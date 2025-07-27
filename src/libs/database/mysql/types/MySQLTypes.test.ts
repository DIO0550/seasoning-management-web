import { describe, test, expect } from "vitest";
import type { MySQLQueryResult } from "./MySQLTypes";
import { MySQLError, createMySQLError } from "../errors";
import {
  MySQLQueryResultConverter,
  MySQLConnectionConfigConverter,
} from "../converters";
import type { ConnectionConfig } from "@/libs/database/interfaces/IDatabaseConnection";

describe("MySQLTypes", () => {
  describe("MySQLQueryResultConverter.toQueryResult", () => {
    test("mysql2のクエリ結果を独自のQueryResultに変換できる", () => {
      // Red: テストを先に書く
      const mysqlResult: MySQLQueryResult = {
        rows: [{ id: 1, name: "テスト調味料" }],
        fields: [],
        affectedRows: 1,
        insertId: 1,
        changedRows: 0,
        warningCount: 0,
      };

      const result = MySQLQueryResultConverter.toQueryResult(mysqlResult);

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

    test("挿入IDがnullの場合はnullを返す", () => {
      const mysqlResult: MySQLQueryResult = {
        rows: [],
        fields: [],
        affectedRows: 0,
        insertId: 0,
        changedRows: 0,
        warningCount: 0,
      };

      const result = MySQLQueryResultConverter.toQueryResult(mysqlResult);

      expect(result.insertId).toBeNull();
    });
  });

  describe("MySQLConnectionConfigConverter.from", () => {
    test("独自のConnectionConfigをMySQL設定に変換できる", () => {
      const config: ConnectionConfig = {
        host: "localhost",
        port: 3306,
        database: "test_db",
        username: "test_user",
        password: "test_pass",
        connectTimeout: 5000,
        queryTimeout: 10000,
        maxConnections: 10,
        minConnections: 1,
      };

      const mysqlConfig = MySQLConnectionConfigConverter.from(config);

      expect(mysqlConfig).toEqual({
        host: "localhost",
        port: 3306,
        database: "test_db",
        user: "test_user",
        password: "test_pass",
        acquireTimeout: 5000,
        timeout: 10000,
        connectionLimit: 10,
        // mysqlConfigには最小接続数は含まれない
      });
    });

    test("SSL設定がbooleanの場合は適切に変換される", () => {
      const config: ConnectionConfig = {
        host: "localhost",
        port: 3306,
        database: "test_db",
        username: "test_user",
        password: "test_pass",
        ssl: true,
      };

      const mysqlConfig = MySQLConnectionConfigConverter.from(config);

      expect(mysqlConfig.ssl).toBe("Amazon RDS");
    });

    test("SSL設定がfalseの場合はundefinedになる", () => {
      const config: ConnectionConfig = {
        host: "localhost",
        port: 3306,
        database: "test_db",
        username: "test_user",
        password: "test_pass",
        ssl: false,
      };

      const mysqlConfig = MySQLConnectionConfigConverter.from(config);

      expect(mysqlConfig.ssl).toBeUndefined();
    });

    test("SSL設定がオブジェクトの場合は適切に変換される", () => {
      const sslOptions = {
        ca: "ca-certificate",
        key: "private-key",
        cert: "certificate",
      };

      const config: ConnectionConfig = {
        host: "localhost",
        port: 3306,
        database: "test_db",
        username: "test_user",
        password: "test_pass",
        ssl: sslOptions,
      };

      const mysqlConfig = MySQLConnectionConfigConverter.from(config);

      expect(mysqlConfig.ssl).toEqual(sslOptions);
    });
  });

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
