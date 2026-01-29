import { expect, test, vi } from "vitest";
import type {
  IDatabaseConnection,
  QueryResult,
} from "@/libs/database/interfaces/core";
import { MySQLSeasoningTemplateRepository } from "@/infrastructure/database/repositories/mysql/my-sql-seasoning-template-repository";

const createMockConnection = <T>(
  queryImpl: (sql: string, params?: unknown[]) => Promise<QueryResult<T>>,
): IDatabaseConnection => ({
  connect: vi.fn().mockResolvedValue(undefined),
  disconnect: vi.fn().mockResolvedValue(undefined),
  isConnected: vi.fn().mockReturnValue(true),
  beginTransaction: vi.fn(),
  ping: vi.fn(),
  getConfig: vi.fn(),
  query: vi.fn(queryImpl) as unknown as IDatabaseConnection["query"],
});

const createCountResult = (cnt: number): QueryResult<{ cnt: number }> => ({
  rows: [{ cnt }],
  rowsAffected: 0,
  insertId: null,
});

test("findAll: 検索条件とページネーションを反映して取得する", async () => {
  const createdAt = new Date("2024-01-01T00:00:00.000Z");
  const updatedAt = new Date("2024-01-02T00:00:00.000Z");

  const queryMock = vi
    .fn()
    .mockResolvedValueOnce(createCountResult(2))
    .mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: "醤油",
          type_id: 1,
          image_id: null,
          created_at: createdAt,
          updated_at: updatedAt,
        },
      ],
      rowsAffected: 0,
      insertId: null,
    });

  const connection = createMockConnection(queryMock);
  const repository = new MySQLSeasoningTemplateRepository(connection);

  const result = await repository.findAll({
    search: "醤油",
    pagination: { page: 2, limit: 1 },
  });

  expect(queryMock).toHaveBeenNthCalledWith(
    1,
    "SELECT COUNT(*) AS cnt FROM seasoning_template WHERE name LIKE ? ESCAPE '\\\\'",
    ["%醤油%"],
  );
  expect(queryMock).toHaveBeenNthCalledWith(
    2,
    expect.stringContaining("SELECT * FROM seasoning_template"),
    ["%醤油%", 1, 1],
  );
  expect(result.total).toBe(2);
  expect(result.page).toBe(2);
  expect(result.limit).toBe(1);
  expect(result.totalPages).toBe(2);
});

test("findAll: % を含む検索文字列をエスケープする", async () => {
  const queryMock = vi
    .fn()
    .mockResolvedValueOnce(createCountResult(1))
    .mockResolvedValueOnce({
      rows: [],
      rowsAffected: 0,
      insertId: null,
    });

  const connection = createMockConnection(queryMock);
  const repository = new MySQLSeasoningTemplateRepository(connection);

  await repository.findAll({
    search: "%",
    pagination: { page: 1, limit: 20 },
  });

  expect(queryMock).toHaveBeenNthCalledWith(
    1,
    "SELECT COUNT(*) AS cnt FROM seasoning_template WHERE name LIKE ? ESCAPE '\\\\'",
    ["%\\%%"],
  );
});

test("findAll: _ を含む検索文字列をエスケープする", async () => {
  const queryMock = vi
    .fn()
    .mockResolvedValueOnce(createCountResult(0))
    .mockResolvedValueOnce({
      rows: [],
      rowsAffected: 0,
      insertId: null,
    });

  const connection = createMockConnection(queryMock);
  const repository = new MySQLSeasoningTemplateRepository(connection);

  await repository.findAll({
    search: "_",
    pagination: { page: 1, limit: 20 },
  });

  expect(queryMock).toHaveBeenNthCalledWith(
    1,
    "SELECT COUNT(*) AS cnt FROM seasoning_template WHERE name LIKE ? ESCAPE '\\\\'",
    ["%\\_%"],
  );
});

test("findAll: \\\\ を含む検索文字列をエスケープする", async () => {
  const queryMock = vi
    .fn()
    .mockResolvedValueOnce(createCountResult(0))
    .mockResolvedValueOnce({
      rows: [],
      rowsAffected: 0,
      insertId: null,
    });

  const connection = createMockConnection(queryMock);
  const repository = new MySQLSeasoningTemplateRepository(connection);

  await repository.findAll({
    search: "\\",
    pagination: { page: 1, limit: 20 },
  });

  expect(queryMock).toHaveBeenNthCalledWith(
    1,
    "SELECT COUNT(*) AS cnt FROM seasoning_template WHERE name LIKE ? ESCAPE '\\\\'",
    ["%\\\\%"],
  );
});
