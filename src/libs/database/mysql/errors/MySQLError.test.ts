import { describe, test, expect } from "vitest";
import { MySQLError, createMySQLError } from "./MySQLError";

describe("MySQLError", () => {
  describe("createMySQLError", () => {
    test("mysql2エラーから独自エラーを作成できる", () => {
      const mysqlError = {
        code: "ER_ACCESS_DENIED_ERROR",
        errno: 1045,
        message: "Access denied for user 'test'@'localhost'",
        sqlState: "28000",
        sqlMessage: "Access denied for user 'test'@'localhost'",
      };

      const error = createMySQLError(mysqlError, "CONNECTION_ERROR");

      expect(error).toBeInstanceOf(MySQLError);
      expect(error.type).toBe("CONNECTION_ERROR");
      expect(error.mysqlCode).toBe("ER_ACCESS_DENIED_ERROR");
      expect(error.mysqlErrno).toBe(1045);
      expect(error.message).toContain("Access denied for user");
    });

    test("unknown mysqlエラーの場合は適切に処理される", () => {
      const unknownError = new Error("Unknown error");

      const error = createMySQLError(unknownError, "QUERY_ERROR");

      expect(error).toBeInstanceOf(MySQLError);
      expect(error.type).toBe("QUERY_ERROR");
      expect(error.mysqlCode).toBeUndefined();
      expect(error.mysqlErrno).toBeUndefined();
      expect(error.message).toBe("Unknown error");
    });
  });
});
