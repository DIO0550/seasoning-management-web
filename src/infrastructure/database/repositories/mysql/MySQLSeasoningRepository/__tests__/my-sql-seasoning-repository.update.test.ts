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

test("[update] 正常系: 調味料が正常に更新され、affectedRowsが返される", async () => {
  // Mock update query
  const updateSpy = vi.spyOn(conn, "query").mockResolvedValueOnce({
    rows: [],
    rowsAffected: 1,
    insertId: null,
  });

  const result = await repo.update(1, { name: "Updated Name" });

  expect(updateSpy).toHaveBeenCalledTimes(1);
  const firstCall = updateSpy.mock.calls[0];
  expect(firstCall).toBeDefined();
  if (!firstCall) {
    throw new Error("Expected conn.query to be called");
  }
  const [sql, params] = firstCall;
  expect(String(sql)).toContain(
    "UPDATE seasoning SET name = ?, updated_at = ? WHERE id = ?"
  );
  expect(params).toEqual(["Updated Name", expect.any(Date), 1]);

  expect(result.affectedRows).toBe(1);
  expect(params).toBeDefined();
  if (!params) {
    throw new Error("Expected query params to be provided");
  }
  expect(result.updatedAt).toEqual(params[1]);
});

test("[update] 正常系: 部分更新（一部のフィールドのみ更新）が正しく動作する", async () => {
  const updateSpy = vi.spyOn(conn, "query").mockResolvedValueOnce({
    rows: [],
    rowsAffected: 1,
    insertId: null,
  });

  await repo.update(1, { name: "Updated Name", typeId: 2 });

  const [sql, params] = updateSpy.mock.calls[0];
  expect(String(sql)).toContain(
    "UPDATE seasoning SET name = ?, type_id = ?, updated_at = ? WHERE id = ?"
  );
  expect(params).toEqual(["Updated Name", 2, expect.any(Date), 1]);
});

test("[update] 正常系: 空の入力の場合、affectedRows: 0 が返される", async () => {
  const updateSpy = vi.spyOn(conn, "query");

  const result = await repo.update(1, {});

  expect(updateSpy).not.toHaveBeenCalled();
  expect(result.affectedRows).toBe(0);
});

test("[update] 異常系: 存在しないIDへの更新でaffectedRows: 0が返される", async () => {
  const updateSpy = vi.spyOn(conn, "query").mockResolvedValueOnce({
    rows: [],
    rowsAffected: 0,
    insertId: null,
  });

  const result = await repo.update(999, { name: "Updated Name" });

  expect(updateSpy).toHaveBeenCalledTimes(1);
  expect(result.affectedRows).toBe(0);
});
