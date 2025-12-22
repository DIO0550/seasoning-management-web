import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/seasonings/[seasoningId]/route";
import { NotFoundError } from "@/domain/errors/not-found-error";

const executeMock = vi.fn();

vi.mock("@/features/seasonings/usecases/get-seasoning", () => ({
  GetSeasoningUseCase: vi.fn().mockImplementation(() => ({
    execute: executeMock,
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
    bestBeforeAt: "2025-12-31T00:00:00.000Z",
    expiresAt: null,
    purchasedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    expiryStatus: "fresh",
    daysUntilExpiry: 365,
  };

  executeMock.mockResolvedValue(mockOutput);

  const req = new NextRequest("http://localhost/api/seasonings/1");
  const params = Promise.resolve({ seasoningId: "1" });
  const res = await GET(req, { params });

  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ data: mockOutput });
  expect(executeMock).toHaveBeenCalledWith({ seasoningId: 1 });
});

test("異常系: 存在しないIDの場合、404を返す", async () => {
  executeMock.mockRejectedValue(new NotFoundError("Seasoning", 999));

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
