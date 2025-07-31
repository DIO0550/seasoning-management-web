import { describe, test, expect, vi } from "vitest";
import { databaseConfig } from "@/config/database";

// 環境変数をモック
vi.mock("@/config/environment", () => ({
  env: {
    NODE_ENV: "test",
    DATABASE_HOST: "localhost",
    DATABASE_PORT: 3306,
    DATABASE_USER: "test_user",
    DATABASE_PASSWORD: "test_password",
    DATABASE_NAME: "seasoning_management_db",
  },
}));

describe("Database Configuration", () => {
  describe("databaseConfig", () => {
    test("should have correct database configuration values", () => {
      expect(databaseConfig).toBeDefined();
      expect(databaseConfig.host).toBeDefined();
      expect(databaseConfig.port).toBeDefined();
      expect(databaseConfig.user).toBeDefined();
      expect(databaseConfig.password).toBeDefined();
      expect(databaseConfig.database).toBeDefined();
    });

    test("should have valid port number", () => {
      expect(typeof databaseConfig.port).toBe("number");
      expect(databaseConfig.port).toBeGreaterThan(0);
      expect(databaseConfig.port).toBeLessThanOrEqual(65535);
    });

    test("should have connectionLimit as a positive number", () => {
      expect(typeof databaseConfig.connectionLimit).toBe("number");
      expect(databaseConfig.connectionLimit).toBeGreaterThan(0);
    });

    test("should have correct charset and timezone", () => {
      expect(databaseConfig.charset).toBe("utf8mb4");
      expect(databaseConfig.timezone).toBe("+00:00");
    });

    test("should have reconnect enabled", () => {
      expect(databaseConfig.reconnect).toBe(true);
    });

    test("should have timeout configurations", () => {
      expect(databaseConfig.acquireTimeout).toBeGreaterThan(0);
      expect(databaseConfig.timeout).toBeGreaterThan(0);
    });

    test("should use test database name in test environment", () => {
      expect(databaseConfig.database).toBe("seasoning_management_db_test");
    });

    test("should have reasonable connection pool settings", () => {
      expect(databaseConfig.connectionLimit).toBeGreaterThanOrEqual(1);
      expect(databaseConfig.connectionLimit).toBeLessThanOrEqual(100);
    });

    test("should have reasonable timeout values", () => {
      expect(databaseConfig.acquireTimeout).toBeGreaterThan(0);
      expect(databaseConfig.timeout).toBeGreaterThan(0);
      // タイムアウトは実用的な範囲内であること
      expect(databaseConfig.acquireTimeout).toBeLessThan(60000); // 60秒以下
      expect(databaseConfig.timeout).toBeLessThan(300000); // 5分以下
    });

    test("should have correct MySQL charset", () => {
      expect(databaseConfig.charset).toBe("utf8mb4");
    });

    test("should have UTC timezone setting", () => {
      expect(databaseConfig.timezone).toBe("+00:00");
    });
  });

  describe("Database configuration structure", () => {
    test("should be configuration object with defined properties", () => {
      const config = databaseConfig;

      // 設定オブジェクトの不変性をテストするのではなく、設定値が適切であることをテスト
      expect(config.host).toBeDefined();
      expect(config.port).toBeDefined();
      expect(config.user).toBeDefined();
      expect(config.database).toBeDefined();
    });

    test("should contain all required database connection properties", () => {
      const requiredProperties = [
        "host",
        "port",
        "user",
        "password",
        "database",
        "connectionLimit",
        "acquireTimeout",
        "timeout",
        "reconnect",
        "charset",
        "timezone",
      ];

      requiredProperties.forEach((property) => {
        expect(databaseConfig).toHaveProperty(property);
        expect(
          databaseConfig[property as keyof typeof databaseConfig]
        ).toBeDefined();
      });
    });
  });
});
