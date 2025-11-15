import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import type { RequestInit as NextRequestInit } from "next/dist/server/web/spec-extension/request";
import { GET, POST } from "@/app/api/seasonings/route";
import {
  DuplicateError,
  NotFoundError,
} from "@/domain/errors";
import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/IDatabaseConnection";

const createUseCaseExecuteMock = vi.fn();

vi.mock("@/features/seasonings/usecases/create-seasoning", () => ({
  CreateSeasoningUseCase: vi.fn().mockImplementation(() => ({
    execute: createUseCaseExecuteMock,
  })),
}));

vi.mock("@/infrastructure/database/ConnectionManager", () => ({
  ConnectionManager: {
    getInstance: vi.fn(() => ({
      getConnection: vi.fn(),
    })),
  },
}));

const findAllMock = vi.fn();
const getStatisticsMock = vi.fn();

const mockSeasoningRepository: ISeasoningRepository = {
  connection: {} as IDatabaseConnection,
  findAll: findAllMock,
  getStatistics: getStatisticsMock,
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByName: vi.fn(),
  findByTypeId: vi.fn(),
  findExpiringSoon: vi.fn(),
  count: vi.fn(),
};

const mockSeasoningTypeRepository =
  {} as unknown as ISeasoningTypeRepository;
const mockSeasoningImageRepository =
  {} as unknown as ISeasoningImageRepository;

vi.mock("@/infrastructure/di/RepositoryFactory", () => ({
  RepositoryFactory: vi.fn().mockImplementation(() => ({
    createSeasoningRepository: vi.fn(async () => mockSeasoningRepository),
    createSeasoningTypeRepository: vi.fn(
      async () => mockSeasoningTypeRepository
    ),
    createSeasoningImageRepository: vi.fn(
      async () => mockSeasoningImageRepository
    ),
  })),
}));

const createRequest = ({
  method = "GET",
  body,
  searchParams,
}: {
  method?: string;
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
} = {}): NextRequest => {
  const url = new URL("http://localhost:3000/api/seasonings");

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const init: NextRequestInit = {
    method,
  };

  if (body) {
    init.headers = {
      "Content-Type": "application/json",
    };
    init.body = JSON.stringify(body);
  }

  return new NextRequest(url, init);
};

beforeEach(() => {
  vi.clearAllMocks();
  createUseCaseExecuteMock.mockReset();

  findAllMock.mockReset();
  findAllMock.mockResolvedValue({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  getStatisticsMock.mockReset();
  getStatisticsMock.mockResolvedValue({
    total: 0,
    expiringSoon: 0,
    expired: 0,
  });
});

// GET /api/seasonings

test.concurrent("GET /api/seasonings は一覧を取得できる", async () => {
  const request = createRequest({ method: "GET" });
  const response = await GET(request);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.meta).toHaveProperty("totalItems", 0);
  expect(data.summary).toHaveProperty("totalCount", 0);
});

test.concurrent("GET /api/seasonings は meta/summary を含む空レスポンスを返す", async () => {
  const request = createRequest({ method: "GET" });
  const response = await GET(request);
  const data = await response.json();

  expect(data.data).toEqual([]);
  expect(data.meta.totalItems).toBe(0);
  expect(data.summary.expiringCount).toBe(0);
});

// POST /api/seasonings

test("POST /api/seasonings - 正常に作成できる", async () => {
  const detail = {
    id: 10,
    name: "醤油",
    typeId: 2,
    typeName: "液体調味料",
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: "2025-11-15T00:00:00.000Z",
    updatedAt: "2025-11-15T00:00:00.000Z",
  };

  createUseCaseExecuteMock.mockResolvedValue(detail);

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 2,
      },
    })
  );

  expect(response.status).toBe(201);
  await expect(response.json()).resolves.toEqual({ data: detail });
  expect(createUseCaseExecuteMock).toHaveBeenCalledWith({
    name: "醤油",
    typeId: 2,
  });
});

test("POST /api/seasonings - バリデーションエラー時は400と詳細を返す", async () => {
  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "",
        typeId: 1,
      },
    })
  );

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.code).toBe("VALIDATION_ERROR_NAME_REQUIRED");
  expect(payload.details?.[0]?.field).toBe("name");
});

test("POST /api/seasonings - 日付形式が不正な場合はVALIDATION_ERROR_DATE_INVALID", async () => {
  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 1,
        bestBeforeAt: "2025/12/01",
      },
    })
  );

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.code).toBe("VALIDATION_ERROR_DATE_INVALID");
});

test("POST /api/seasonings - DuplicateError は409とDUPLICATE_NAMEを返す", async () => {
  createUseCaseExecuteMock.mockRejectedValue(
    new DuplicateError("name", "醤油")
  );

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 1,
      },
    })
  );

  expect(response.status).toBe(409);
  const payload = await response.json();
  expect(payload.code).toBe("DUPLICATE_NAME");
});

test("POST /api/seasonings - SeasoningTypeが存在しない場合は404", async () => {
  createUseCaseExecuteMock.mockRejectedValue(
    new NotFoundError("SeasoningType", 999)
  );

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 999,
      },
    })
  );

  expect(response.status).toBe(404);
  const payload = await response.json();
  expect(payload.code).toBe("SEASONING_TYPE_NOT_FOUND");
});

test("POST /api/seasonings - SeasoningImageが存在しない場合は404", async () => {
  createUseCaseExecuteMock.mockRejectedValue(
    new NotFoundError("SeasoningImage", 55)
  );

  const response = await POST(
    createRequest({
      method: "POST",
      body: {
        name: "醤油",
        typeId: 1,
        imageId: 55,
      },
    })
  );

  expect(response.status).toBe(404);
  const payload = await response.json();
  expect(payload.code).toBe("SEASONING_IMAGE_NOT_FOUND");
});
