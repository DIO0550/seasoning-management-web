import { test, expect, vi } from "vitest";
import type {
  IDatabaseConnection,
  QueryResult,
} from "@/libs/database/interfaces/core";
import { MySQLSeasoningTypeRepository } from "@/infrastructure/database/repositories/mysql/my-sql-seasoning-type-repository";

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

test("指定した名前が存在する場合に true を返す", async () => {
  const connection = createMockConnection(async () => createCountResult(1));
  const repository = new MySQLSeasoningTypeRepository(connection);

  const result = await repository.existsByName("塩");

  expect(result).toBe(true);
  expect(connection.query).toHaveBeenCalledWith(
    "SELECT COUNT(*) as cnt FROM seasoning_type WHERE name = ?",
    ["塩"],
  );
});

test("指定した名前が存在しない場合に false を返す", async () => {
  const connection = createMockConnection(async () => createCountResult(0));
  const repository = new MySQLSeasoningTypeRepository(connection);

  const result = await repository.existsByName("砂糖");

  expect(result).toBe(false);
  expect(connection.query).toHaveBeenCalledWith(
    "SELECT COUNT(*) as cnt FROM seasoning_type WHERE name = ?",
    ["砂糖"],
  );
});

test("excludeId を指定した場合に条件から除外して重複判定する", async () => {
  const connection = createMockConnection(async (_sql, params) => {
    expect(params).toEqual(["味噌", 10]);
    return createCountResult(0);
  });
  const repository = new MySQLSeasoningTypeRepository(connection);

  const result = await repository.existsByName("味噌", 10);

  expect(result).toBe(false);
  expect(connection.query).toHaveBeenCalledWith(
    "SELECT COUNT(*) as cnt FROM seasoning_type WHERE name = ? AND id <> ?",
    ["味噌", 10],
  );
});

test("指定した名前で調味料種類を取得できる", async () => {
  const createdAt = new Date("2024-01-01T00:00:00.000Z");
  const updatedAt = new Date("2024-01-02T00:00:00.000Z");

  const connection = createMockConnection(async () => ({
    rows: [
      {
        id: 1,
        name: "塩",
        created_at: createdAt,
        updated_at: updatedAt,
      },
    ],
    rowsAffected: 0,
    insertId: null,
  }));
  const repository = new MySQLSeasoningTypeRepository(connection);

  const result = await repository.findByName("塩");

  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(1);
  expect(result[0].name).toBe("塩");
  expect(connection.query).toHaveBeenCalledWith(
    "SELECT * FROM seasoning_type WHERE name = ?",
    ["塩"],
  );
});
