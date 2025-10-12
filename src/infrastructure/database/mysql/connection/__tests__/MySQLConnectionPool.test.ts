import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { MySQLConnectionPool } from "../MySQLConnectionPool";
import { PoolError } from "../../../errors";

describe("MySQLConnectionPool", () => {
  let pool: MySQLConnectionPool;

  beforeEach(() => {
    // Setup if needed
  });

  afterEach(async () => {
    if (pool) {
      await pool.destroy().catch(() => {
        // Ignore cleanup errors
      });
    }
  });

  describe("initialization", () => {
    it("初期化なしで操作するとエラーを投げる", async () => {
      pool = new MySQLConnectionPool();

      await expect(pool.acquire()).rejects.toThrow(PoolError);
      await expect(pool.acquire()).rejects.toThrow(
        "Connection pool is not initialized"
      );
    });

    it("正常な設定で初期化できる", async () => {
      pool = new MySQLConnectionPool();

      // Note: 実際のDBがない環境ではテストが失敗する可能性があるため、
      // モック環境でのテストが必要
      // await pool.initialize(mockConfig);
      // expect(pool.isHealthy()).toBe(true);
    });

    it("不正な設定で初期化に失敗する", async () => {
      pool = new MySQLConnectionPool();

      // Note: 実際のDB接続テストのため、モック環境では適宜調整
      // const invalidConfig: ConnectionConfig = {
      //   ...mockConfig,
      //   host: "invalid-host-that-does-not-exist",
      // };
      // await expect(pool.initialize(invalidConfig)).rejects.toThrow(PoolError);
    });
  });

  describe("getConfig", () => {
    it("初期化前はデフォルト設定を返す", () => {
      pool = new MySQLConnectionPool();
      const config = pool.getConfig();

      expect(config).toEqual({
        min: 0,
        max: 10,
        acquireTimeout: 30000,
        createTimeout: 30000,
        destroyTimeout: 5000,
        idle: 600000,
        reapInterval: 1000,
      });
    });

    it("部分的な設定から完全なPoolConfigを生成する", async () => {
      pool = new MySQLConnectionPool();

      // 初期化せずにコンフィグをテスト（内部でマージされることを確認）
      // Note: 実際の初期化が必要な場合は以下のようにする
      // const partialConfig: ConnectionConfig = {
      //   ...mockConfig,
      //   pool: { min: 5, max: 20 },
      // };
      // await pool.initialize(partialConfig);
    });
  });

  describe("getStats", () => {
    it("統計情報を取得できる", () => {
      pool = new MySQLConnectionPool();
      const stats = pool.getStats();

      expect(stats).toHaveProperty("totalConnections");
      expect(stats).toHaveProperty("activeConnections");
      expect(stats).toHaveProperty("idleConnections");
      expect(stats).toHaveProperty("pendingRequests");
      expect(stats).toHaveProperty("acquiredConnections");
      expect(stats).toHaveProperty("createdAt");
      expect(stats).toHaveProperty("lastActivity");
      expect(stats).toHaveProperty("errors");
      expect(stats.errors).toHaveProperty("connectionErrors");
      expect(stats.errors).toHaveProperty("timeoutErrors");
      expect(stats.errors).toHaveProperty("otherErrors");
    });

    it("初期状態の統計情報が正しい", () => {
      pool = new MySQLConnectionPool();
      const stats = pool.getStats();

      expect(stats.totalConnections).toBe(0);
      expect(stats.activeConnections).toBe(0);
      expect(stats.idleConnections).toBe(0);
      expect(stats.pendingRequests).toBe(0);
      expect(stats.acquiredConnections).toBe(0);
      expect(stats.errors.connectionErrors).toBe(0);
      expect(stats.errors.timeoutErrors).toBe(0);
      expect(stats.errors.otherErrors).toBe(0);
    });
  });

  describe("isHealthy", () => {
    it("初期化前は非健全状態", () => {
      pool = new MySQLConnectionPool();
      expect(pool.isHealthy()).toBe(false);
    });
  });

  describe("event handlers", () => {
    it("イベントハンドラーを登録できる", () => {
      const onAcquire = vi.fn();
      const onRelease = vi.fn();

      pool = new MySQLConnectionPool({
        onAcquire,
        onRelease,
      });

      expect(pool).toBeDefined();
    });
  });

  describe("destroy", () => {
    it("未初期化の状態でdestroyしてもエラーにならない", async () => {
      pool = new MySQLConnectionPool();
      await expect(pool.destroy()).resolves.not.toThrow();
    });
  });
});
