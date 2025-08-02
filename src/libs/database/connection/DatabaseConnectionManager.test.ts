/**
 * DatabaseConnectionManagerのテスト
 * @description シングルトンパターンの動作とデータベース接続管理をテストする
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DatabaseConnectionManager } from "./DatabaseConnectionManager";

// vi.hoisted()を使ってモックオブジェクトを巻き上げ対応で定義
const mockMysql2Connection = vi.hoisted(() => ({
  connect: vi.fn().mockResolvedValue(undefined),
  end: vi.fn().mockResolvedValue(undefined),
  query: vi.fn(),
  beginTransaction: vi.fn(),
  commit: vi.fn(),
  rollback: vi.fn(),
  ping: vi.fn().mockResolvedValue(true),
  destroy: vi.fn(),
  release: vi.fn(),
  config: {
    host: "localhost",
    port: 3306,
    user: "test",
    password: "test",
    database: "test_db",
  },
}));

const mockPool = vi.hoisted(() => ({
  getConnection: vi.fn().mockResolvedValue(mockMysql2Connection),
  end: vi.fn(),
}));

// 外部依存のみモック
vi.mock("mysql2/promise", () => ({
  default: {
    createPool: vi.fn().mockReturnValue(mockPool),
  },
}));

vi.mock("@/config/database", () => ({
  databaseConfig: {
    host: "localhost",
    port: 3306,
    user: "test",
    password: "test",
    database: "test_db",
    connectionLimit: 10,
    timezone: "+09:00",
    charset: "utf8mb4",
  },
}));

describe("DatabaseConnectionManager", () => {
  beforeEach(async () => {
    // すべてのモックをクリア
    vi.clearAllMocks();

    // 環境変数をクリア
    vi.unstubAllEnvs();

    // デフォルトでテスト環境に設定
    vi.stubEnv("NODE_ENV", "test");

    // インスタンスをリセット
    DatabaseConnectionManager.resetInstanceForTesting();
  });

  afterEach(() => {
    // 環境変数を復元
    vi.unstubAllEnvs();
  });

  describe("シングルトンパターンのテスト", () => {
    it("getInstance()は常に同じインスタンスを返すべき", () => {
      // Act
      const instance1 = DatabaseConnectionManager.getInstance();
      const instance2 = DatabaseConnectionManager.getInstance();

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(DatabaseConnectionManager);
    });

    it("複数回getInstance()を呼んでも新しいインスタンスは作成されないべき", () => {
      // Act
      const instance1 = DatabaseConnectionManager.getInstance();
      const instance2 = DatabaseConnectionManager.getInstance();
      const instance3 = DatabaseConnectionManager.getInstance();

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
    });
  });

  describe("データベース接続のテスト", () => {
    it("初回のgetConnection()でデータベース接続を作成するべき", async () => {
      // Arrange
      const manager = DatabaseConnectionManager.getInstance();

      // Act
      const connection = await manager.getConnection();

      // Assert
      expect(connection).toBeDefined();
      expect(connection).toHaveProperty("connect");
      expect(connection).toHaveProperty("disconnect");
      expect(connection).toHaveProperty("query");
      expect(connection).toHaveProperty("isConnected");
      expect(typeof connection.isConnected).toBe("function");
    });

    it("2回目のgetConnection()では既存の接続を返すべき", async () => {
      // Arrange
      const manager = DatabaseConnectionManager.getInstance();

      // Act
      const connection1 = await manager.getConnection();
      const connection2 = await manager.getConnection();

      // Assert
      expect(connection1).toBe(connection2); // 同じ接続を返す
    });

    it("接続が切断されている場合は再接続するべき", async () => {
      // Arrange
      const manager = DatabaseConnectionManager.getInstance();

      // 最初の接続を作成
      const connection1 = await manager.getConnection();

      // 接続を強制的に切断
      await manager.closeConnection();

      // Act: 再度接続を取得
      const connection2 = await manager.getConnection();

      // Assert
      expect(connection2).toBeDefined();
      expect(connection2).not.toBe(connection1); // 新しい接続が作成される
    });
  });

  describe("環境別接続のテスト", () => {
    it("development環境で接続を作成できるべき", async () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "development");
      const manager = DatabaseConnectionManager.getInstance();

      // Act
      const connection = await manager.getConnection();

      // Assert
      expect(connection).toBeDefined();
      expect(manager.getEnvironment()).toBe("development");
    });

    it("production環境で接続を作成できるべき", async () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "production");
      const manager = DatabaseConnectionManager.getInstance();

      // Act
      const connection = await manager.getConnection();

      // Assert
      expect(connection).toBeDefined();
      expect(manager.getEnvironment()).toBe("production");
    });

    it("test環境で接続を作成できるべき", async () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "test");
      const manager = DatabaseConnectionManager.getInstance();

      // Act
      const connection = await manager.getConnection();

      // Assert
      expect(connection).toBeDefined();
      expect(manager.getEnvironment()).toBe("test");
    });

    it("未対応環境でエラーを投げるべき", async () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "unknown");
      const manager = DatabaseConnectionManager.getInstance();

      // Act & Assert
      await expect(manager.getConnection()).rejects.toThrow(
        "Unsupported environment: unknown"
      );
    });
  });

  describe("接続管理のテスト", () => {
    it("closeConnection()で接続を閉じるべき", async () => {
      // Arrange
      const manager = DatabaseConnectionManager.getInstance();
      await manager.getConnection(); // 接続を作成

      // Act
      await manager.closeConnection();

      // Assert
      expect(manager.isConnected()).toBe(false);
    });

    it("接続がない状態でcloseConnection()を呼んでもエラーにならないべき", async () => {
      // Arrange
      const manager = DatabaseConnectionManager.getInstance();

      // Act & Assert
      await expect(manager.closeConnection()).resolves.not.toThrow();
    });

    it("isConnected()で接続状態を正しく返すべき", async () => {
      // Arrange
      const manager = DatabaseConnectionManager.getInstance();

      // Act & Assert
      expect(manager.isConnected()).toBe(false); // 初期状態

      // 接続を取得
      await manager.getConnection();
      expect(manager.isConnected()).toBe(true); // 接続後

      // 接続を閉じた状態
      await manager.closeConnection();
      expect(manager.isConnected()).toBe(false); // 切断後
    });

    it("getEnvironment()で現在の環境を返すべき", () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "test");
      const manager = DatabaseConnectionManager.getInstance();

      // Act
      const environment = manager.getEnvironment();

      // Assert
      expect(environment).toBe("test");
    });
  });

  describe("エラーハンドリングのテスト", () => {
    it("接続作成エラーを適切にハンドリングするべき", async () => {
      // Arrange
      vi.clearAllMocks();
      // MySQL2のgetConnectionがエラーを投げるように設定
      const mysql = await import("mysql2/promise");
      const createPool = mysql.default.createPool as ReturnType<typeof vi.fn>;
      createPool.mockReturnValueOnce({
        getConnection: vi
          .fn()
          .mockRejectedValueOnce(new Error("Connection failed")),
      });

      // シングルトンインスタンスをリセットして新しいマネージャーを作成
      DatabaseConnectionManager.resetInstanceForTesting();
      const manager = DatabaseConnectionManager.getInstance();

      // Act & Assert
      await expect(manager.getConnection()).rejects.toThrow(
        "Connection failed"
      );
    });

    it("接続切断エラーを適切にハンドリングするべき", async () => {
      // Arrange
      const manager = DatabaseConnectionManager.getInstance();
      await manager.getConnection(); // 接続を作成

      // MySQL2接続のendメソッドがエラーを投げるように設定
      mockMysql2Connection.end.mockRejectedValueOnce(
        new Error("Disconnect failed")
      );

      // Act & Assert
      await expect(manager.closeConnection()).rejects.toThrow(
        "Failed to close database connection: Disconnect failed"
      );
    });
  });

  describe("テスト用メソッドのテスト", () => {
    it("resetInstanceForTesting()はテスト環境でのみ動作するべき", async () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "test");
      const instance1 = DatabaseConnectionManager.getInstance();
      await instance1.getConnection(); // 接続を作成して状態を確認

      // Act
      DatabaseConnectionManager.resetInstanceForTesting();
      const instance2 = DatabaseConnectionManager.getInstance();

      // Assert: インスタンスが変わり、接続状態もリセットされている
      expect(instance1).not.toBe(instance2);
      expect(instance2.isConnected()).toBe(false);
    });

    it("resetInstanceForTesting()は本番環境では動作しないべき", () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "production");
      const instance1 = DatabaseConnectionManager.getInstance();

      // Act
      DatabaseConnectionManager.resetInstanceForTesting();
      const instance2 = DatabaseConnectionManager.getInstance();

      // Assert
      expect(instance1).toBe(instance2);
    });
  });
});
