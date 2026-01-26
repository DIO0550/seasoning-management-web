import { it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { seasoningTypeDetailResponseSchema } from "@/types/api/seasoningType/detail/schemas";

vi.mock("@/infrastructure/database/connection-manager");
vi.mock("@/infrastructure/di/repository-factory");

const mockSeasoningTypeRepository = {
  findById: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (ConnectionManager.getInstance as ReturnType<typeof vi.fn>).mockReturnValue(
    {},
  );
  (RepositoryFactory as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    () => ({
      createSeasoningTypeRepository: vi
        .fn()
        .mockResolvedValue(mockSeasoningTypeRepository),
    }),
  );
});

it("GET: 正常系: 調味料種類の詳細を取得できること", async () => {
  mockSeasoningTypeRepository.findById.mockResolvedValue({
    id: 1,
    name: "種類1",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  });

  const response = await GET(
    new NextRequest("http://localhost/api/seasoning-types/1"),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.data).toEqual({
    id: 1,
    name: "種類1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  });
  expect(seasoningTypeDetailResponseSchema.safeParse(body).success).toBe(true);
});

it("GET: 異常系: パラメータが不正な場合、400エラーを返すこと", async () => {
  const response = await GET(
    new NextRequest("http://localhost/api/seasoning-types/invalid"),
    {
      params: Promise.resolve({ typeId: "invalid" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("INVALID_PARAMETER");
  expect(body.details[0].field).toBe("typeId");
});

it("GET: 異常系: 存在しない場合、404エラーを返すこと", async () => {
  mockSeasoningTypeRepository.findById.mockResolvedValue(null);

  const response = await GET(
    new NextRequest("http://localhost/api/seasoning-types/999"),
    {
      params: Promise.resolve({ typeId: "999" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(404);
  expect(body.code).toBe("NOT_FOUND");
});

it("GET: 異常系: 予期せぬエラーの場合、500エラーを返すこと", async () => {
  mockSeasoningTypeRepository.findById.mockRejectedValue(new Error("DB Error"));

  const response = await GET(
    new NextRequest("http://localhost/api/seasoning-types/1"),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(500);
  expect(body.code).toBe("INTERNAL_ERROR");
});
