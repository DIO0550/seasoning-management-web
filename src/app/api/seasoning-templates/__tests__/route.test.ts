import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import type { RequestInit as NextRequestInit } from "next/dist/server/web/spec-extension/request";
import { GET } from "@/app/api/seasoning-templates";
import { SeasoningTemplate } from "@/libs/database/entities/seasoning-template";
import type { ISeasoningTemplateRepository } from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/i-database-connection";

vi.mock("@/infrastructure/database/connection-manager", () => ({
  ConnectionManager: {
    getInstance: vi.fn(() => ({
      getConnection: vi.fn(),
    })),
  },
}));

const findAllMock = vi.fn();

const mockSeasoningTemplateRepository: ISeasoningTemplateRepository = {
  connection: {} as IDatabaseConnection,
  create: vi.fn(),
  findById: vi.fn(),
  findAll: findAllMock,
  update: vi.fn(),
  delete: vi.fn(),
  findByName: vi.fn(),
  findByTypeId: vi.fn(),
  createSeasoningFromTemplate: vi.fn(),
  existsByName: vi.fn(),
  count: vi.fn(),
  countByTypeId: vi.fn(),
};

vi.mock("@/infrastructure/di/repository-factory", () => ({
  RepositoryFactory: vi.fn().mockImplementation(() => ({
    createSeasoningTemplateRepository: vi.fn(
      async () => mockSeasoningTemplateRepository,
    ),
  })),
}));

const createRequest = ({
  searchParams,
}: {
  searchParams?: Record<string, string>;
} = {}): NextRequest => {
  const url = new URL("http://localhost:3000/api/seasoning-templates");

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const init: NextRequestInit = {
    method: "GET",
  };

  return new NextRequest(url, init);
};

beforeEach(() => {
  vi.clearAllMocks();
  findAllMock.mockReset();
  findAllMock.mockResolvedValue({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
});

test("GET /api/seasoning-templates は一覧を取得できる", async () => {
  const createdAt = new Date("2024-01-01T00:00:00.000Z");
  const updatedAt = new Date("2024-01-02T00:00:00.000Z");

  findAllMock.mockResolvedValue({
    items: [
      new SeasoningTemplate({
        id: 1,
        name: "醤油",
        typeId: 1,
        imageId: null,
        createdAt,
        updatedAt,
      }),
    ],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const response = await GET(createRequest());
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.data).toHaveLength(1);
  expect(data.meta.totalItems).toBe(1);
  expect(data.data[0].name).toBe("醤油");
});

test("GET /api/seasoning-templates は空の検索文字列を無視する", async () => {
  const response = await GET(
    createRequest({
      searchParams: {
        search: "",
      },
    }),
  );

  expect(response.status).toBe(200);
  expect(findAllMock).toHaveBeenCalledWith({
    search: undefined,
    pagination: { page: 1, limit: 20 },
  });
});

test("GET /api/seasoning-templates は空白のみの検索文字列を無視する", async () => {
  const response = await GET(
    createRequest({
      searchParams: {
        search: " ",
      },
    }),
  );

  expect(response.status).toBe(200);
  expect(findAllMock).toHaveBeenCalledWith({
    search: undefined,
    pagination: { page: 1, limit: 20 },
  });
});

test("GET /api/seasoning-templates はpage超過時も空配列を返す", async () => {
  findAllMock.mockResolvedValue({
    items: [],
    total: 1,
    page: 3,
    limit: 1,
    totalPages: 1,
  });

  const response = await GET(
    createRequest({
      searchParams: {
        page: "3",
        pageSize: "1",
      },
    }),
  );
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.data).toEqual([]);
  expect(data.meta.hasNext).toBe(false);
  expect(data.meta.hasPrevious).toBe(true);
});

test("GET /api/seasoning-templates はpageが不正な場合に400を返す", async () => {
  const response = await GET(
    createRequest({
      searchParams: {
        page: "abc",
      },
    }),
  );
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.code).toBe("VALIDATION_ERROR_PAGE_INVALID");
  expect(data.details?.[0]?.field).toBe("page");
});

test("GET /api/seasoning-templates はpageSizeが小さすぎる場合に400を返す", async () => {
  const response = await GET(
    createRequest({
      searchParams: {
        pageSize: "0",
      },
    }),
  );
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.code).toBe("VALIDATION_ERROR_PAGE_SIZE_TOO_SMALL");
  expect(data.details?.[0]?.field).toBe("pageSize");
});

test("GET /api/seasoning-templates はpageSizeが大きすぎる場合に400を返す", async () => {
  const response = await GET(
    createRequest({
      searchParams: {
        pageSize: "101",
      },
    }),
  );
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.code).toBe("VALIDATION_ERROR_PAGE_SIZE_TOO_LARGE");
  expect(data.details?.[0]?.field).toBe("pageSize");
});

test("GET /api/seasoning-templates はsearchが長すぎる場合に400を返す", async () => {
  const response = await GET(
    createRequest({
      searchParams: {
        search: "a".repeat(51),
      },
    }),
  );
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.code).toBe("VALIDATION_ERROR_SEARCH_TOO_LONG");
  expect(data.details?.[0]?.field).toBe("search");
});
