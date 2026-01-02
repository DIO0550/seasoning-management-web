import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH } from "@/app/api/seasonings/[seasoningId]/route";
import { NotFoundError } from "@/domain/errors/not-found-error";

const getExecuteMock = vi.fn();
const updateExecuteMock = vi.fn();

vi.mock("@/features/seasonings/usecases/get-seasoning", () => ({
  GetSeasoningUseCase: vi.fn().mockImplementation(() => ({
    execute: getExecuteMock,
  })),
}));

vi.mock("@/features/seasonings/usecases/update-seasoning", () => ({
  UpdateSeasoningUseCase: vi.fn().mockImplementation(() => ({
    execute: updateExecuteMock,
  })),
}));

vi.mock("@/infrastructure/database/connection-manager", () => ({
  ConnectionManager: {
    getInstance: vi.fn(() => ({})),
  },
}));

vi.mock("@/infrastructure/di/repository-factory", () => ({
  RepositoryFactory: vi.fn().mockImplementation(() => ({
    createSeasoningRepository: vi.fn(),
    createSeasoningTypeRepository: vi.fn(),
    createSeasoningImageRepository: vi.fn(),
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("正常系: 存在するIDの場合、200と調味料詳細を返す", async () => {
  const mockOutput = {
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: "2025-12-31",
    expiresAt: null,
    purchasedAt: "2025-01-01",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 365,
  };

  getExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1");
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await GET(req, { params });

  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ data: mockOutput });
  expect(getExecuteMock).toHaveBeenCalledWith({ seasoningId: 1 });
});

test("異常系: 存在しないIDの場合、404を返す", async () => {
  getExecuteMock.mockRejectedValue(new NotFoundError("Seasoning", 999));

  const req = new NextRequest("http://localhost/api/seasonings/999");
  const params = Promise.resolve({ seasoningId: "999" });
  const res = await GET(req, { params });

  expect(res.status).toBe(404);
  const json = await res.json();
  expect(json.code).toBe("NOT_FOUND");
});

test("異常系: 無効なID（文字列）の場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/abc");
  const params = Promise.resolve({ seasoningId: "abc" });
  const res = await GET(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("INVALID_PARAMETER");
});

test("異常系: 無効なID（負数）の場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/-1");
  const params = Promise.resolve({ seasoningId: "-1" });
  const res = await GET(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("INVALID_PARAMETER");
});

test("PATCH正常系: 名前のみを更新した場合、200と更新後のデータを返す", async () => {
  const mockOutput = {
    id: 1,
    name: "濃口醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: "2025-12-31",
    expiresAt: null,
    purchasedAt: "2025-01-01",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 365,
  };

  updateExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1", {
    method: "PATCH",
    body: JSON.stringify({ name: "濃口醤油" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ data: mockOutput });
  expect(updateExecuteMock).toHaveBeenCalledWith({
    seasoningId: 1,
    name: "濃口醤油",
  });
});

test("PATCH正常系: 複数フィールドを更新した場合、200と更新後のデータを返す", async () => {
  const mockOutput = {
    id: 1,
    name: "濃口醤油",
    typeId: 2,
    imageId: 5,
    bestBeforeAt: "2026-06-01",
    expiresAt: "2026-06-15",
    purchasedAt: "2025-12-01",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 365,
  };

  updateExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1", {
    method: "PATCH",
    body: JSON.stringify({
      name: "濃口醤油",
      typeId: 2,
      imageId: 5,
      bestBeforeAt: "2026-06-01",
      expiresAt: "2026-06-15",
      purchasedAt: "2025-12-01",
    }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json.data.name).toBe("濃口醤油");
  expect(json.data.typeId).toBe(2);
});

test("PATCH正常系: imageIdをnullに設定した場合、200を返す", async () => {
  const mockOutput = {
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: "2025-12-31",
    expiresAt: null,
    purchasedAt: "2025-01-01",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 365,
  };

  updateExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1", {
    method: "PATCH",
    body: JSON.stringify({ imageId: null }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json.data.imageId).toBeNull();
});

test("PATCH異常系: 存在しないIDの場合、404を返す", async () => {
  updateExecuteMock.mockRejectedValue(new NotFoundError("seasoning", 999));

  const req = new NextRequest("http://localhost/api/seasonings/999", {
    method: "PATCH",
    body: JSON.stringify({ name: "更新名" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "999" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(404);
  const json = await res.json();
  expect(json.code).toBe("NOT_FOUND");
});

test("PATCH異常系: 無効なID（文字列）の場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/abc", {
    method: "PATCH",
    body: JSON.stringify({ name: "更新名" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "abc" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("INVALID_PARAMETER");
});

test("PATCH異常系: 無効な日付フォーマットの場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/1", {
    method: "PATCH",
    body: JSON.stringify({ bestBeforeAt: "2025/12/31" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("VALIDATION_ERROR");
});

test("PATCH異常系: 空文字の名前の場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/1", {
    method: "PATCH",
    body: JSON.stringify({ name: "" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("VALIDATION_ERROR");
});

test("PATCH異常系: 未知のフィールドがある場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/1", {
    method: "PATCH",
    body: JSON.stringify({ unknownField: "value" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await PATCH(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("VALIDATION_ERROR");
});
