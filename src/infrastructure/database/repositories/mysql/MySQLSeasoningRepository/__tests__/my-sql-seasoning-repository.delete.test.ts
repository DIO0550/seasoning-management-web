import { test, expect, beforeEach, vi } from "vitest";
import { MySQLSeasoningRepository } from "..";
import type { IDatabaseConnection } from "@/infrastructure/database/interfaces";
import { createMockConnection } from "@/libs/database/__tests__/config/test-db-config";

let conn: IDatabaseConnection;
let repo: MySQLSeasoningRepository;

beforeEach(async () => {
  conn = await createMockConnection();
  repo = new MySQLSeasoningRepository(conn);
});

test("[queries] delete は DELETE FROM seasoning WHERE id = ? を発行する", async () => {
  const spy = vi.spyOn(conn, "query").mockResolvedValue({
    rows: [],
    rowsAffected: 1,
    insertId: null,
  });

  const result = await repo.delete(42);

  expect(spy).toHaveBeenCalledTimes(1);
  const [sql, params] = spy.mock.calls[0];
  expect(String(sql)).toMatch(
    /DELETE\s+FROM\s+seasoning\s+WHERE\s+id\s*=\s*\?/i
  );
  expect(params).toEqual([42]);
  expect(result.affectedRows).toBe(1);
});

test("[queries] delete は存在しないIDでもaffectedRows=0を返す", async () => {
  const spy = vi.spyOn(conn, "query").mockResolvedValue({
    rows: [],
    rowsAffected: 0,
    insertId: null,
  });

  const result = await repo.delete(999);

  expect(spy).toHaveBeenCalledTimes(1);
  const [sql, params] = spy.mock.calls[0];
  expect(String(sql)).toMatch(/DELETE\s+FROM\s+seasoning/i);
  expect(params).toEqual([999]);
  expect(result.affectedRows).toBe(0);
});
