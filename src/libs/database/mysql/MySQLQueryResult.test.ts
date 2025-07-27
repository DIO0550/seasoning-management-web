import { describe, test, expect } from "vitest";
import type { MySQLQueryResult as MySQLQueryResultType } from "@/libs/database/mysql/MySQLQueryResult";
import { MySQLQueryResult } from "@/libs/database/mysql/MySQLQueryResult";

describe("MySQLQueryResult", () => {
  describe("MySQLQueryResult.toQueryResult", () => {
    test("mysql2のクエリ結果を独自のQueryResultに変換できる", () => {
      // Red: テストを先に書く
      const mysqlResult: MySQLQueryResultType = {
        rows: [{ id: 1, name: "テスト調味料" }],
        fields: [],
        affectedRows: 1,
        insertId: 1,
        changedRows: 0,
        warningCount: 0,
      };

      const result = MySQLQueryResult.toQueryResult(mysqlResult);

      expect(result).toEqual({
        rows: [{ id: 1, name: "テスト調味料" }],
        rowsAffected: 1,
        insertId: 1,
        metadata: {
          changedRows: 0,
          warningCount: 0,
        },
      });
    });

    test("挿入IDが0の場合はnullを返す", () => {
      const mysqlResult: MySQLQueryResultType = {
        rows: [],
        fields: [],
        affectedRows: 0,
        insertId: 0,
        changedRows: 0,
        warningCount: 0,
      };

      const result = MySQLQueryResult.toQueryResult(mysqlResult);

      expect(result.insertId).toBeNull();
    });

    test("挿入IDが0以外の場合はその値を返す", () => {
      const mysqlResult: MySQLQueryResultType = {
        rows: [],
        fields: [],
        affectedRows: 1,
        insertId: 123,
        changedRows: 0,
        warningCount: 0,
      };

      const result = MySQLQueryResult.toQueryResult(mysqlResult);

      expect(result.insertId).toBe(123);
    });

    test("メタデータが正しく変換される", () => {
      const mysqlResult: MySQLQueryResultType = {
        rows: [],
        fields: [],
        affectedRows: 2,
        insertId: 0,
        changedRows: 1,
        warningCount: 3,
      };

      const result = MySQLQueryResult.toQueryResult(mysqlResult);

      expect(result.metadata).toEqual({
        changedRows: 1,
        warningCount: 3,
      });
    });

    test("複数行のデータが正しく変換される", () => {
      const mysqlResult: MySQLQueryResultType = {
        rows: [
          { id: 1, name: "醤油" },
          { id: 2, name: "味噌" },
          { id: 3, name: "塩" },
        ],
        fields: [],
        affectedRows: 3,
        insertId: 0,
        changedRows: 0,
        warningCount: 0,
      };

      const result = MySQLQueryResult.toQueryResult(mysqlResult);

      expect(result.rows).toHaveLength(3);
      expect(result.rows[0]).toEqual({ id: 1, name: "醤油" });
      expect(result.rows[1]).toEqual({ id: 2, name: "味噌" });
      expect(result.rows[2]).toEqual({ id: 3, name: "塩" });
      expect(result.rowsAffected).toBe(3);
    });
  });
});
