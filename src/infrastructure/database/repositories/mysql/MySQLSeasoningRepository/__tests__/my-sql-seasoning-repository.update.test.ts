import { test, expect, beforeEach, vi } from "vitest";
import { MySQLSeasoningRepository } from "..";
import type { IDatabaseConnection } from "@/infrastructure/database/interfaces";
import { createMockConnection } from "@/libs/database/__tests__/config/test-db-config";
import type { Seasoning } from "@/domain/entities/seasoning/seasoning";

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

  // Mock findById (called after update)
  const now = new Date();
  const findSpy = vi.spyOn(repo, "findById").mockResolvedValueOnce({
    id: 1,
    name: "Updated Name",
    updatedAt: now,
  } as unknown as Seasoning);

  const result = await repo.update(1, { name: "Updated Name" });

  expect(updateSpy).toHaveBeenCalledTimes(1);
  const [sql, params] = updateSpy.mock.calls[0];
  expect(String(sql)).toContain(
    "UPDATE seasoning SET name = ?, updated_at = NOW() WHERE id = ?"
  );
  expect(params).toEqual(["Updated Name", 1]);

  expect(findSpy).toHaveBeenCalledWith(1);
  expect(result.affectedRows).toBe(1);
  expect(result.updatedAt).toEqual(now);
});

test("[update] 正常系: 部分更新（一部のフィールドのみ更新）が正しく動作する", async () => {
  const updateSpy = vi.spyOn(conn, "query").mockResolvedValueOnce({
    rows: [],
    rowsAffected: 1,
    insertId: null,
  });

  const now = new Date();
  vi.spyOn(repo, "findById").mockResolvedValueOnce({
    id: 1,
    name: "Updated Name",
    typeId: 2,
    updatedAt: now,
  } as unknown as Seasoning);

  await repo.update(1, { name: "Updated Name", typeId: 2 });

  const [sql, params] = updateSpy.mock.calls[0];
  expect(String(sql)).toContain(
    "UPDATE seasoning SET name = ?, type_id = ?, updated_at = NOW() WHERE id = ?"
  );
  expect(params).toEqual(["Updated Name", 2, 1]);
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

  const findSpy = vi.spyOn(repo, "findById");

  const result = await repo.update(999, { name: "Updated Name" });

  expect(updateSpy).toHaveBeenCalledTimes(1);
  expect(findSpy).not.toHaveBeenCalled(); // rowsAffected 0 so findById is not called
  expect(result.affectedRows).toBe(0);
});
