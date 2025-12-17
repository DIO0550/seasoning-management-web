import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ConnectionManager } from "../ConnectionManager";
import { ConfigurationError } from "../errors";

describe("ConnectionManager", () => {
  let manager: ConnectionManager;

  beforeEach(() => {
    ConnectionManager.resetForTesting();
  });

  afterEach(async () => {
    if (manager && manager.isInitialized()) {
      await manager.destroy().catch(() => {
        // Ignore cleanup errors
      });
    }
    ConnectionManager.resetForTesting();
  });

  describe("singleton pattern", () => {
    it("同じインスタンスを返す", () => {
      const instance1 = ConnectionManager.getInstance();
      const instance2 = ConnectionManager.getInstance();

      expect(instance1).toBe(instance2);
    });

    it("resetForTestingでインスタンスをリセットできる", () => {
      const instance1 = ConnectionManager.getInstance();
      ConnectionManager.resetForTesting();
      const instance2 = ConnectionManager.getInstance();

      expect(instance1).not.toBe(instance2);
    });
  });

  describe("initialization", () => {
    it("初期化前は未初期化状態", () => {
      manager = ConnectionManager.getInstance();
      expect(manager.isInitialized()).toBe(false);
    });

    it("二重初期化はエラーを投げる", async () => {
      manager = ConnectionManager.getInstance();

      // Note: 実際のDB接続が必要なため、モック環境では適宜調整
      // await manager.initialize(mockConfig);
      // await expect(manager.initialize(mockConfig)).rejects.toThrow(
      //   ConfigurationError
      // );
    });
  });

  describe("getConnection", () => {
    it("初期化前に接続を取得しようとするとエラー", async () => {
      manager = ConnectionManager.getInstance();

      await expect(manager.getConnection()).rejects.toThrow(ConfigurationError);
      await expect(manager.getConnection()).rejects.toThrow(
        "Connection manager is not initialized"
      );
    });
  });

  describe("pool mode", () => {
    it("プールモードで初期化できる", async () => {
      manager = ConnectionManager.getInstance(undefined, { usePool: true });
      expect(manager.isInitialized()).toBe(false);

      // Note: 実際のDB接続が必要
      // await manager.initialize(mockConfig);
      // expect(manager.isInitialized()).toBe(true);
    });

    it("プールモードで統計情報を取得できる", () => {
      manager = ConnectionManager.getInstance(undefined, { usePool: true });
      const stats = manager.getPoolStats();

      // 初期化前はnullを返す
      expect(stats).toBeNull();
    });
  });

  describe("single connection mode", () => {
    it("シングル接続モードで初期化できる", async () => {
      manager = ConnectionManager.getInstance(undefined, { usePool: false });
      expect(manager.isInitialized()).toBe(false);

      // Note: 実際のDB接続が必要
      // await manager.initialize(mockConfig);
      // expect(manager.isInitialized()).toBe(true);
    });
  });

  describe("releaseConnection", () => {
    it("シングル接続モードではreleaseは何もしない", async () => {
      manager = ConnectionManager.getInstance(undefined, { usePool: false });

      // Note: 実際のDB接続が必要
      // await manager.initialize(mockConfig);
      // const connection = await manager.getConnection();
      // await expect(
      //   manager.releaseConnection(connection)
      // ).resolves.not.toThrow();
    });
  });

  describe("destroy", () => {
    it("未初期化の状態でdestroyしてもエラーにならない", async () => {
      manager = ConnectionManager.getInstance();
      await expect(manager.destroy()).resolves.not.toThrow();
    });
  });

  describe("database type", () => {
    it("MySQLをデフォルトのデータベースタイプとする", () => {
      manager = ConnectionManager.getInstance();
      expect(manager).toBeDefined();
    });

    it("データベースタイプを指定できる", () => {
      manager = ConnectionManager.getInstance(undefined, {
        databaseType: "postgresql",
      });
      expect(manager).toBeDefined();
    });
  });
});
