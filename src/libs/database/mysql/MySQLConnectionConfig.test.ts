import { describe, test, expect } from "vitest";
import type { ConnectionConfig } from "@/libs/database/interfaces/IDatabaseConnection";
import { MySQLConnectionConfig } from "@/libs/database/mysql/MySQLConnectionConfig";

describe("MySQLConnectionConfig", () => {
  describe("MySQLConnectionConfig.from", () => {
    test("基本的なConnectionConfigをMySQL設定に変換できる", () => {
      const config: ConnectionConfig = {
        host: "localhost",
        port: 3306,
        database: "test_db",
        username: "test_user",
        password: "test_pass",
      };

      const mysqlConfig = MySQLConnectionConfig.from(config);

      expect(mysqlConfig).toEqual({
        host: "localhost",
        port: 3306,
        database: "test_db",
        user: "test_user",
        password: "test_pass",
      });
    });

    test("全てのオプションが含まれた設定を変換できる", () => {
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

      const mysqlConfig = MySQLConnectionConfig.from(config);

      expect(mysqlConfig).toEqual({
        host: "localhost",
        port: 3306,
        database: "test_db",
        user: "test_user",
        password: "test_pass",
        acquireTimeout: 5000,
        timeout: 10000,
        connectionLimit: 10,
        // minConnectionsは含まれない
      });
    });

    test("SSL設定がtrueの場合は文字列に変換される", () => {
      const config: ConnectionConfig = {
        host: "localhost",
        port: 3306,
        database: "test_db",
        username: "test_user",
        password: "test_pass",
        ssl: true,
      };

      const mysqlConfig = MySQLConnectionConfig.from(config);

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

      const mysqlConfig = MySQLConnectionConfig.from(config);

      expect(mysqlConfig.ssl).toBeUndefined();
    });

    test("SSL設定がオブジェクトの場合はそのまま設定される", () => {
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

      const mysqlConfig = MySQLConnectionConfig.from(config);

      expect(mysqlConfig.ssl).toEqual(sslOptions);
    });

    test("optionsが含まれている場合は設定に追加される", () => {
      const config: ConnectionConfig = {
        host: "localhost",
        port: 3306,
        database: "test_db",
        username: "test_user",
        password: "test_pass",
        options: {
          charset: "utf8mb4",
          timezone: "+09:00",
        },
      };

      const mysqlConfig = MySQLConnectionConfig.from(config);

      expect(mysqlConfig).toEqual({
        host: "localhost",
        port: 3306,
        database: "test_db",
        user: "test_user",
        password: "test_pass",
        charset: "utf8mb4",
        timezone: "+09:00",
      });
    });

    test("一部のオプションのみが設定されている場合", () => {
      const config: ConnectionConfig = {
        host: "remote-db.example.com",
        port: 3307,
        database: "production_db",
        username: "prod_user",
        password: "prod_pass",
        connectTimeout: 30000,
        // queryTimeout, maxConnections, ssl は未設定
      };

      const mysqlConfig = MySQLConnectionConfig.from(config);

      expect(mysqlConfig).toEqual({
        host: "remote-db.example.com",
        port: 3307,
        database: "production_db",
        user: "prod_user",
        password: "prod_pass",
        acquireTimeout: 30000,
        // timeout, connectionLimit, ssl は含まれない
      });
    });
  });
});
