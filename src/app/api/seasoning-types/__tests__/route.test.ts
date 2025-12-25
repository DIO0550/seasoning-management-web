import { it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { DuplicateError } from "@/domain/errors";

const executeMock = vi.fn();

// モックの設定
vi.mock("@/infrastructure/database/connection-manager");
vi.mock("@/infrastructure/di/repository-factory");
vi.mock("@/features/seasoning-types/usecases/create-seasoning-type", () => ({
  CreateSeasoningTypeUseCase: vi.fn().mockImplementation(() => ({
    execute: executeMock,
  })),
}));

const mockSeasoningTypeRepository = {
  findAll: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  existsByName: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  executeMock.mockReset();
  mockSeasoningTypeRepository.existsByName.mockResolvedValue(false);
  (ConnectionManager.getInstance as ReturnType<typeof vi.fn>).mockReturnValue(
    {}
  );
  (
    RepositoryFactory as unknown as ReturnType<typeof vi.fn>
  ).mockImplementation(() => ({
    createSeasoningTypeRepository: vi
      .fn()
      .mockResolvedValue(mockSeasoningTypeRepository),
  }));
});

it("GET: 正常系: 調味料種類の一覧を取得できること", async () => {
  const mockData = {
    items: [
      {
        id: 1,
        name: "種類1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "種類2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };
  mockSeasoningTypeRepository.findAll.mockResolvedValue(mockData);

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.data).toHaveLength(2);
  expect(body.data[0]).toEqual({ id: 1, name: "種類1" });
});

it("GET: 異常系: DBエラーが発生した場合、500エラーを返すこと", async () => {
  mockSeasoningTypeRepository.findAll.mockRejectedValue(new Error("DB Error"));

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(500);
  expect(body.message).toBe("システムエラーが発生しました");
});

it("POST: 正常系: 調味料種類を追加できること", async () => {
  const requestBody = { name: "新しい種類" };
  const request = new NextRequest("http://localhost/api/seasoning-types", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  executeMock.mockResolvedValue({
    id: 1,
    name: "新しい種類",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  });

  const response = await POST(request);
  const body = await response.json();

  expect(response.status).toBe(201);
  expect(body.data.name).toBe("新しい種類");
});

it("POST: 異常系: バリデーションエラーの場合、400エラーを返すこと", async () => {
  const requestBody = { name: "" };
  const request = new NextRequest("http://localhost/api/seasoning-types", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  const response = await POST(request);
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("VALIDATION_ERROR_NAME_REQUIRED");
});

it("POST: 異常系: DBエラーが発生した場合、500エラーを返すこと", async () => {
  const requestBody = { name: "新しい種類" };
  const request = new NextRequest("http://localhost/api/seasoning-types", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  executeMock.mockRejectedValue(new Error("DB Error"));

  const response = await POST(request);

  expect(response.status).toBe(500);
});

it("POST: 異常系: 重複した名前の場合、400エラーを返すこと", async () => {
  const requestBody = { name: "既存の種類" };
  const request = new NextRequest("http://localhost/api/seasoning-types", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  executeMock.mockRejectedValue(new DuplicateError("name", "既存の種類"));

  const response = await POST(request);
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.code).toBe("DUPLICATE_NAME");
});
