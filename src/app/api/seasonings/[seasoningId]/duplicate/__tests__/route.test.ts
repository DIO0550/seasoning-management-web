import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/seasonings/[seasoningId]/duplicate/route";
import { NotFoundError, DuplicateError } from "@/domain/errors";

const duplicateExecuteMock = vi.fn();

vi.mock("@/features/seasonings/usecases/duplicate-seasoning", () => ({
  DuplicateSeasoningUseCase: vi.fn().mockImplementation(() => ({
    execute: duplicateExecuteMock,
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
    createSeasoningImageRepository: vi.fn(),
  })),
}));

beforeEach(() => {
  duplicateExecuteMock.mockReset();
  vi.clearAllMocks();
});

test("正常系: 名前を指定して複製した場合、201と新規作成データを返す", async () => {
  const mockOutput = {
    id: 2,
    name: "新しい醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt: "2025-12-01",
    expiresAt: "2025-12-20",
    purchasedAt: "2025-11-01",
    createdAt: "2025-11-11T12:00:00.000Z",
    updatedAt: "2025-11-11T12:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 30,
  };

  duplicateExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({ name: "新しい醤油" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual({ data: mockOutput });
  expect(duplicateExecuteMock).toHaveBeenCalledWith({
    seasoningId: 1,
    name: "新しい醤油",
  });
});

test("正常系: ボディなしで複製した場合、201を返す", async () => {
  const mockOutput = {
    id: 2,
    name: "醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt: "2025-12-01",
    expiresAt: "2025-12-20",
    purchasedAt: "2025-11-01",
    createdAt: "2025-11-11T12:00:00.000Z",
    updatedAt: "2025-11-11T12:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 30,
  };

  duplicateExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual({ data: mockOutput });
  expect(duplicateExecuteMock).toHaveBeenCalledWith({
    seasoningId: 1,
  });
});

test("正常系: 全フィールドを上書きして複製した場合、201を返す", async () => {
  const mockOutput = {
    id: 2,
    name: "新しい醤油",
    typeId: 1,
    imageId: 20,
    bestBeforeAt: "2026-01-01",
    expiresAt: "2026-01-15",
    purchasedAt: "2025-12-01",
    createdAt: "2025-11-11T12:00:00.000Z",
    updatedAt: "2025-11-11T12:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 60,
  };

  duplicateExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({
      name: "新しい醤油",
      imageId: 20,
      bestBeforeAt: "2026-01-01",
      expiresAt: "2026-01-15",
      purchasedAt: "2025-12-01",
    }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(201);
  expect(duplicateExecuteMock).toHaveBeenCalledWith({
    seasoningId: 1,
    name: "新しい醤油",
    imageId: 20,
    bestBeforeAt: "2026-01-01",
    expiresAt: "2026-01-15",
    purchasedAt: "2025-12-01",
  });
});

test("正常系: 日付とimageIdをnullに設定して複製した場合、201を返す", async () => {
  const mockOutput = {
    id: 2,
    name: "新しい醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: "2025-11-11T12:00:00.000Z",
    updatedAt: "2025-11-11T12:00:00.000Z",
    expiryStatus: "unknown",
    daysUntilExpiry: null,
  };

  duplicateExecuteMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({
      name: "新しい醤油",
      imageId: null,
      bestBeforeAt: null,
      expiresAt: null,
      purchasedAt: null,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(201);
});

test("異常系: 無効なseasoningId（文字列）の場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/abc/duplicate", {
    method: "POST",
  });
  const params = Promise.resolve({ seasoningId: "abc" });
  const res = await POST(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("INVALID_PARAMETER");
});

test("異常系: 無効なseasoningId（負数）の場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/-1/duplicate", {
    method: "POST",
  });
  const params = Promise.resolve({ seasoningId: "-1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("INVALID_PARAMETER");
});

test("異常系: 名前が空文字の場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({ name: "" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("VALIDATION_ERROR");
});

test("異常系: 無効な日付フォーマットの場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({ purchasedAt: "invalid-date" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("VALIDATION_ERROR");
});

test("異常系: 存在しない調味料を複製しようとした場合、404を返す", async () => {
  duplicateExecuteMock.mockRejectedValue(new NotFoundError("seasoning", 999));

  const req = new NextRequest("http://localhost/api/seasonings/999/duplicate", {
    method: "POST",
    body: JSON.stringify({ name: "新しい醤油" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "999" });
  const res = await POST(req, { params });

  expect(res.status).toBe(404);
  const json = await res.json();
  expect(json.code).toBe("NOT_FOUND");
});

test("異常系: 名前が重複している場合、409を返す", async () => {
  duplicateExecuteMock.mockRejectedValue(
    new DuplicateError("name", "既存の醤油")
  );

  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({ name: "既存の醤油" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(409);
  const json = await res.json();
  expect(json.code).toBe("DUPLICATE_ERROR");
});

test("異常系: 存在しない画像IDを指定した場合、404を返す", async () => {
  duplicateExecuteMock.mockRejectedValue(
    new NotFoundError("seasoning-image", 999)
  );

  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({ name: "新しい醤油", imageId: 999 }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(404);
  const json = await res.json();
  expect(json.code).toBe("NOT_FOUND");
});

test("異常系: 予期しないエラーの場合、500を返す", async () => {
  duplicateExecuteMock.mockRejectedValue(new Error("Unknown error"));

  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({ name: "新しい醤油" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(500);
});

test("異常系: 不明なフィールドがある場合、400を返す", async () => {
  const req = new NextRequest("http://localhost/api/seasonings/1/duplicate", {
    method: "POST",
    body: JSON.stringify({ name: "新しい醤油", unknownField: "test" }),
    headers: { "Content-Type": "application/json" },
  });
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await POST(req, { params });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.code).toBe("VALIDATION_ERROR");
});
