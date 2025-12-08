import { test, expect, vi } from "vitest";
import type {
  IDatabaseConnection,
  QueryResult,
} from "@/libs/database/interfaces/core";
import { MySQLSeasoningTypeRepository } from "@/infrastructure/database/repositories/mysql/MySQLSeasoningTypeRepository";

const createMockConnection = (
  queryImpl: (sql: string, params?: unknown[]) => Promise<{ cnt: number }>
): IDatabaseConnection => {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    isConnected: vi.fn().mockReturnValue(true),
    beginTransaction: vi.fn(),
    ping: vi.fn(),
    getConfig: vi.fn(),
    query: vi.fn(async (sql: string, params?: unknown[]) => {
      const row = await queryImpl(sql, params);
      return {
        rows: [row],
        rowsAffected: 0,
        insertId: null,
      } satisfies QueryResult<{ cnt: number }>;
    }) as unknown as IDatabaseConnection["query"],
  };
};

test("指定した名前が存在する場合に true を返す", async () => {
  const connection = createMockConnection(async () => ({ cnt: 1 }));
  const repository = new MySQLSeasoningTypeRepository(connection);

  const result = await repository.existsByName("塩");

  expect(result).toBe(true);
  expect(connection.query).toHaveBeenCalledWith(
    "SELECT COUNT(*) as cnt FROM seasoning_type WHERE name = ?",
    ["塩"]
  );
});

test("指定した名前が存在しない場合に false を返す", async () => {
  const connection = createMockConnection(async () => ({ cnt: 0 }));
  const repository = new MySQLSeasoningTypeRepository(connection);

  const result = await repository.existsByName("砂糖");

  expect(result).toBe(false);
  expect(connection.query).toHaveBeenCalledWith(
    "SELECT COUNT(*) as cnt FROM seasoning_type WHERE name = ?",
    ["砂糖"]
  );
});

test("excludeId を指定した場合に条件から除外して重複判定する", async () => {
  const connection = createMockConnection(async (_sql, params) => {
    expect(params).toEqual(["味噌", 10]);
    return { cnt: 0 };
  });
  const repository = new MySQLSeasoningTypeRepository(connection);

  const result = await repository.existsByName("味噌", 10);

  expect(result).toBe(false);
  expect(connection.query).toHaveBeenCalledWith(
    "SELECT COUNT(*) as cnt FROM seasoning_type WHERE name = ? AND id <> ?",
    ["味噌", 10]
  );
});
