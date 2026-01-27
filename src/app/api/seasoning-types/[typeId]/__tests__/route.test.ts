import { it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, DELETE, PATCH } from "../route";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { seasoningTypeDetailResponseSchema } from "@/types/api/seasoningType/detail/schemas";
import { createContainer } from "@/infrastructure/di";
import {
  ConflictError as DomainConflictError,
  DuplicateError,
  NotFoundError,
} from "@/domain/errors";
import { ConflictError as DatabaseConflictError } from "@/libs/database/errors";

vi.mock("@/infrastructure/database/connection-manager");
vi.mock("@/infrastructure/di/repository-factory");
vi.mock("@/infrastructure/di", () => ({
  createContainer: vi.fn(),
  INFRASTRUCTURE_IDENTIFIERS: {
    DELETE_SEASONING_TYPE_USE_CASE: Symbol("delete-seasoning-type-use-case"),
    UPDATE_SEASONING_TYPE_USE_CASE: Symbol("update-seasoning-type-use-case"),
  },
}));

const mockSeasoningTypeRepository = {
  findById: vi.fn(),
};

const executeMock = vi.fn();
const containerMock = {
  resolve: vi.fn(),
  clear: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  executeMock.mockReset();
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
  (createContainer as ReturnType<typeof vi.fn>).mockResolvedValue(
    containerMock,
  );
  containerMock.resolve.mockReturnValue({ execute: executeMock });
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

it("DELETE: 正常系: 調味料種類を削除できること", async () => {
  executeMock.mockResolvedValue(undefined);

  const response = await DELETE(
    new NextRequest("http://localhost/api/seasoning-types/1", {
      method: "DELETE",
    }),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );

  expect(response.status).toBe(204);
  expect(containerMock.clear).toHaveBeenCalled();
});

it("DELETE: 異常系: パラメータが不正な場合、400エラーを返すこと", async () => {
  const response = await DELETE(
    new NextRequest("http://localhost/api/seasoning-types/invalid", {
      method: "DELETE",
    }),
    {
      params: Promise.resolve({ typeId: "invalid" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("INVALID_PARAMETER");
});

it("DELETE: 異常系: 存在しない場合、404エラーを返すこと", async () => {
  executeMock.mockRejectedValue(new NotFoundError("seasoning-type", 999));

  const response = await DELETE(
    new NextRequest("http://localhost/api/seasoning-types/999", {
      method: "DELETE",
    }),
    {
      params: Promise.resolve({ typeId: "999" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(404);
  expect(body.code).toBe("NOT_FOUND");
});

it("DELETE: 異常系: 関連データが存在する場合、409エラーを返すこと", async () => {
  executeMock.mockRejectedValue(
    new DomainConflictError("関連データが存在するため削除できません"),
  );

  const response = await DELETE(
    new NextRequest("http://localhost/api/seasoning-types/1", {
      method: "DELETE",
    }),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(409);
  expect(body.code).toBe("CONFLICT");
});

it("DELETE: 異常系: 予期せぬエラーの場合、500エラーを返すこと", async () => {
  executeMock.mockRejectedValue(new Error("DB Error"));

  const response = await DELETE(
    new NextRequest("http://localhost/api/seasoning-types/1", {
      method: "DELETE",
    }),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(500);
  expect(body.code).toBe("INTERNAL_ERROR");
});

it("PATCH: 正常系: 調味料種類を更新できること", async () => {
  executeMock.mockResolvedValue({
    id: 1,
    name: "乾物",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  });

  const response = await PATCH(
    new NextRequest("http://localhost/api/seasoning-types/1", {
      method: "PATCH",
      body: JSON.stringify({ name: "  乾物  " }),
      headers: { "Content-Type": "application/json" },
    }),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.data.name).toBe("乾物");
  expect(executeMock).toHaveBeenCalledWith({ typeId: 1, name: "乾物" });
});

it("PATCH: 異常系: パラメータが不正な場合、400エラーを返すこと", async () => {
  const response = await PATCH(
    new NextRequest("http://localhost/api/seasoning-types/invalid", {
      method: "PATCH",
      body: JSON.stringify({ name: "更新名" }),
      headers: { "Content-Type": "application/json" },
    }),
    {
      params: Promise.resolve({ typeId: "invalid" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("VALIDATION_ERROR_ID_REQUIRED");
});

it("PATCH: 異常系: バリデーションエラーの場合、400エラーを返すこと", async () => {
  const response = await PATCH(
    new NextRequest("http://localhost/api/seasoning-types/1", {
      method: "PATCH",
      body: JSON.stringify({ name: "" }),
      headers: { "Content-Type": "application/json" },
    }),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("VALIDATION_ERROR_NAME_REQUIRED");
});

it("PATCH: 異常系: 存在しない場合、404エラーを返すこと", async () => {
  executeMock.mockRejectedValue(new NotFoundError("seasoning-type", 999));

  const response = await PATCH(
    new NextRequest("http://localhost/api/seasoning-types/999", {
      method: "PATCH",
      body: JSON.stringify({ name: "更新名" }),
      headers: { "Content-Type": "application/json" },
    }),
    {
      params: Promise.resolve({ typeId: "999" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(404);
  expect(body.code).toBe("SEASONING_TYPE_NOT_FOUND");
});

it("PATCH: 異常系: 重複した名前の場合、400エラーを返すこと", async () => {
  executeMock.mockRejectedValue(new DuplicateError("name", "重複"));

  const response = await PATCH(
    new NextRequest("http://localhost/api/seasoning-types/1", {
      method: "PATCH",
      body: JSON.stringify({ name: "重複" }),
      headers: { "Content-Type": "application/json" },
    }),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("DUPLICATE_NAME");
});

it("PATCH: 異常系: ConflictErrorの場合、400エラーを返すこと", async () => {
  executeMock.mockRejectedValue(new DatabaseConflictError("重複"));

  const response = await PATCH(
    new NextRequest("http://localhost/api/seasoning-types/1", {
      method: "PATCH",
      body: JSON.stringify({ name: "重複" }),
      headers: { "Content-Type": "application/json" },
    }),
    {
      params: Promise.resolve({ typeId: "1" }),
    },
  );
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("DUPLICATE_NAME");
});
