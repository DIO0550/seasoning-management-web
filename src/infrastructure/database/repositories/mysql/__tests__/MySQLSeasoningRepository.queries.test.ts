import { describe, it, expect, beforeEach, vi } from "vitest";
import { MySQLSeasoningRepository } from "../MySQLSeasoningRepository";
import { MockDatabaseConnection } from "@/libs/database/__tests__/mocks";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core";

// moved: Use tests colocated with implementation under MySQLSeasoningRepository/__tests__
describe.skip("MySQLSeasoningRepository queries (moved)", () => {
  let conn: IDatabaseConnection;
  let repo: MySQLSeasoningRepository;

  beforeEach(async () => {
    conn = new MockDatabaseConnection({
      host: "localhost",
      port: 3306,
      database: "test_db",
      username: "user",
      maxConnections: 10,
      minConnections: 1,
    });
    await conn.connect();
    repo = new MySQLSeasoningRepository(conn);
  });

  it("findByName は LIKE 検索SQLを発行する", async () => {
    const spy = vi.spyOn(conn, "query").mockResolvedValue({
      rows: [],
      rowsAffected: 0,
      insertId: null,
    });
    await repo.findByName("sho");
    expect(spy).toHaveBeenCalledTimes(1);
    const [sql, params] = spy.mock.calls[0];
    expect(String(sql)).toMatch(/WHERE\s+name\s+LIKE\s+\?/i);
    expect(params).toEqual(["%sho%"]);
  });

  it("findByTypeId は type_id 絞り込みSQLを発行する", async () => {
    const spy = vi.spyOn(conn, "query").mockResolvedValue({
      rows: [],
      rowsAffected: 0,
      insertId: null,
    });
    await repo.findByTypeId(3);
    expect(spy).toHaveBeenCalledTimes(1);
    const [sql, params] = spy.mock.calls[0];
    expect(String(sql)).toMatch(/WHERE\s+type_id\s*=\s*\?/i);
    expect(params).toEqual([3]);
  });

  it("findExpiringSoon は expires_at と INTERVAL ? DAY を使用する", async () => {
    const spy = vi.spyOn(conn, "query").mockResolvedValue({
      rows: [],
      rowsAffected: 0,
      insertId: null,
    });
    await repo.findExpiringSoon(7);
    expect(spy).toHaveBeenCalledTimes(1);
    const [sql, params] = spy.mock.calls[0];
    expect(String(sql)).toMatch(/expires_at\s+IS\s+NOT\s+NULL/i);
    expect(String(sql)).toMatch(/INTERVAL\s+\?\s+DAY/i);
    expect(params).toEqual([7]);
  });

  it("count は COUNT(*) を使用する", async () => {
    const spy = vi.spyOn(conn, "query").mockResolvedValue({
      rows: [{ cnt: 42 }],
      rowsAffected: 0,
      insertId: null,
    });
    const n = await repo.count();
    expect(spy).toHaveBeenCalledTimes(1);
    const [sql] = spy.mock.calls[0];
    expect(String(sql)).toMatch(/COUNT\(\*\)/i);
    expect(n).toBe(42);
  });
});
