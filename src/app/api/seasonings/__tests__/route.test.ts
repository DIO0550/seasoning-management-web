import { test, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/seasonings/route";
// Note: 将来的には createSeasoningStore() を使用してテストごとに独立したストアを作成することを推奨
import { seasoningStore } from "@/app/api/seasonings/store";
import type { ISeasoningRepository } from "@/libs/database/interfaces/repositories/ISeasoningRepository";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/IDatabaseConnection";

// ConnectionManager と RepositoryFactory をモック化
vi.mock("@/infrastructure/database/ConnectionManager", () => ({
  ConnectionManager: {
    getInstance: vi.fn(() => ({
      getConnection: vi.fn(),
    })),
  },
}));

vi.mock("@/infrastructure/di/RepositoryFactory", () => ({
  RepositoryFactory: vi.fn().mockImplementation(() => ({
    createSeasoningRepository: vi.fn(async () => mockRepository),
  })),
}));

// モックリポジトリの作成
const mockRepository: ISeasoningRepository = {
  connection: {} as IDatabaseConnection,
  findAll: vi.fn(async () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByName: vi.fn(),
  findByTypeId: vi.fn(),
  findExpiringSoon: vi.fn(),
  count: vi.fn(),
};

// テスト用のモックリクエスト作成関数
const createRequest = (
  body?: Record<string, unknown>,
  method: string = "POST"
): NextRequest => {
  const url = "http://localhost:3000/api/seasonings";

  if (body) {
    return new NextRequest(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  return new NextRequest(url, { method });
};

// テスト前にデータリセット
beforeEach(() => {
  seasoningStore.clear();
});

// GET /api/seasonings のテスト
test.concurrent(
  "GET /api/seasonings - 調味料一覧を正常に取得できる",
  async () => {
    const request = createRequest(undefined, "GET");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("meta");
    expect(data).toHaveProperty("summary");
    expect(Array.isArray(data.data)).toBe(true);
  }
);

test.concurrent(
  "GET /api/seasonings - 空の配列が返される（初期状態）",
  async () => {
    const request = createRequest(undefined, "GET");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
    expect(data.meta.totalItems).toBe(0);
    expect(data.summary.totalCount).toBe(0);
  }
);

// POST /api/seasonings の正常系テスト
test.each([
  {
    name: "salt",
    seasoningTypeId: 1,
    image: null,
    description: "基本的な調味料データ",
  },
  {
    name: "sugar123",
    seasoningTypeId: 2,
    image: null,
    description: "半角英数字混合",
  },
  {
    name: "a".repeat(20),
    seasoningTypeId: 3,
    image: null,
    description: "名前20文字（境界値）",
  },
  {
    name: "oil",
    seasoningTypeId: 999,
    image: "data:image/jpeg;base64,validBase64String",
    description: "画像データありの場合",
  },
])(
  "POST /api/seasonings - $description で調味料を正常に作成できる",
  async ({ name, seasoningTypeId, image }) => {
    const request = createRequest({ name, seasoningTypeId, image });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      name,
      seasoningTypeId,
      id: expect.any(String),
      createdAt: expect.any(String),
    });

    if (image) {
      expect(data.image).toBe(image);
    }
  }
);

// POST /api/seasonings - 名前フィールドのバリデーション
test("POST /api/seasonings - 名前が空の場合、VALIDATION_ERROR_NAME_REQUIREDが返される", async () => {
  const request = createRequest({
    name: "",
    seasoningTypeId: 1,
    image: null,
  });

  const response = await POST(request);
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data).toEqual({
    result_code: "VALIDATION_ERROR_NAME_REQUIRED",
  });
});

test("POST /api/seasonings - 名前が長すぎる場合、VALIDATION_ERROR_NAME_TOO_LONGが返される", async () => {
  const request = createRequest({
    name: "a".repeat(21), // 21文字
    seasoningTypeId: 1,
    image: null,
  });

  const response = await POST(request);
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data).toEqual({
    result_code: "VALIDATION_ERROR_NAME_TOO_LONG",
  });
});

test("POST /api/seasonings - 名前の形式が無効な場合、VALIDATION_ERROR_NAME_INVALID_FORMATが返される", async () => {
  const request = createRequest({
    name: "調味料", // 日本語
    seasoningTypeId: 1,
    image: null,
  });

  const response = await POST(request);
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data).toEqual({
    result_code: "VALIDATION_ERROR_NAME_INVALID_FORMAT",
  });
});

// POST /api/seasonings - 調味料種類IDのバリデーション
test("POST /api/seasonings - 調味料種類IDが無効な場合、VALIDATION_ERROR_TYPE_REQUIREDが返される", async () => {
  const request = createRequest({
    name: "salt",
    seasoningTypeId: 0, // 無効な値
    image: null,
  });

  const response = await POST(request);
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data).toEqual({
    result_code: "VALIDATION_ERROR_TYPE_REQUIRED",
  });
});

// POST /api/seasonings - 重複チェック
test("POST /api/seasonings - 重複する名前の場合、DUPLICATE_NAMEが返される", async () => {
  // 最初の調味料を作成
  const request1 = createRequest({
    name: "salt",
    seasoningTypeId: 1,
    image: null,
  });
  await POST(request1);

  // 同じ名前で再作成を試行
  const request2 = createRequest({
    name: "salt",
    seasoningTypeId: 2,
    image: null,
  });

  const response = await POST(request2);
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data).toEqual({
    result_code: "DUPLICATE_NAME",
  });
});

// POST /api/seasonings - 正常ケース
test("POST /api/seasonings - 正常なデータの場合、調味料が作成される", async () => {
  const request = createRequest({
    name: "salt",
    seasoningTypeId: 1,
    image: null,
  });

  const response = await POST(request);
  const data = await response.json();

  expect(response.status).toBe(201);
  expect(data).toMatchObject({
    name: "salt",
    seasoningTypeId: 1,
    id: expect.any(String),
    createdAt: expect.any(String),
  });
});
