import { describe, it, expect, beforeEach } from "vitest";
import {
  MockDatabaseConnectionProvider,
  SpyDatabaseConnectionProvider,
} from "./mock-database-connection-provider";
import type { ConnectionConfig } from "@/libs/database/interfaces/core";

describe("mock-database-connection-provider", () => {
  let config: ConnectionConfig;

  beforeEach(() => {
    config = {
      host: "localhost",
      port: 3306,
      database: "test_db",
      username: "test_user",
      maxConnections: 10,
      minConnections: 2,
    };
  });

  describe("基本機能", () => {
    it("接続を取得できる", async () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const connection = await provider.getConnection();

      expect(connection).toBeDefined();
      expect(connection.isConnected()).toBe(true);
    });

    it("同じ接続を再利用する", async () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const connection1 = await provider.getConnection();
      const connection2 = await provider.getConnection();

      expect(connection1).toBe(connection2);
    });

    it("初期化状態を確認できる", () => {
      const provider = new MockDatabaseConnectionProvider(config);

      expect(provider.isInitialized()).toBe(true);
    });

    it("設定を取得できる", () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const retrievedConfig = provider.getConfig();

      expect(retrievedConfig).toEqual(config);
      expect(retrievedConfig).not.toBe(config); // コピーであることを確認
    });

    it("破棄できる", async () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const connection = await provider.getConnection();

      await provider.destroy();

      expect(provider.isInitialized()).toBe(false);
      expect(connection.isConnected()).toBe(false);
    });
  });

  describe("接続操作", () => {
    it("クエリを実行できる", async () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const connection = await provider.getConnection();

      const result = await connection.query("SELECT * FROM users");

      expect(result).toBeDefined();
      expect(result.rows).toEqual([]);
      expect(result.rowsAffected).toBe(0);
    });

    it("トランザクションを開始できる", async () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const connection = await provider.getConnection();

      const transaction = await connection.beginTransaction();

      expect(transaction).toBeDefined();
      expect(transaction.isActive()).toBe(true);
    });

    it("トランザクションをコミットできる", async () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const connection = await provider.getConnection();
      const transaction = await connection.beginTransaction();

      await transaction.commit();

      expect(transaction.getStatus()).toBe("COMMITTED");
      expect(transaction.isActive()).toBe(false);
    });

    it("トランザクションをロールバックできる", async () => {
      const provider = new MockDatabaseConnectionProvider(config);
      const connection = await provider.getConnection();
      const transaction = await connection.beginTransaction();

      await transaction.rollback();

      expect(transaction.getStatus()).toBe("ROLLED_BACK");
      expect(transaction.isActive()).toBe(false);
    });
  });
});

describe("SpyDatabaseConnectionProvider", () => {
  let config: ConnectionConfig;

  beforeEach(() => {
    config = {
      host: "localhost",
      port: 3306,
      database: "test_db",
      username: "test_user",
      maxConnections: 10,
      minConnections: 2,
    };
  });

  describe("スパイ機能", () => {
    it("getConnection呼び出しを記録する", async () => {
      const spy = new SpyDatabaseConnectionProvider(config);

      expect(spy.calls.getConnection).toBe(0);

      await spy.getConnection();
      expect(spy.calls.getConnection).toBe(1);

      await spy.getConnection();
      expect(spy.calls.getConnection).toBe(2);
    });

    it("releaseConnection呼び出しを記録する", async () => {
      const spy = new SpyDatabaseConnectionProvider(config);
      const connection = await spy.getConnection();

      expect(spy.calls.releaseConnection).toBe(0);

      await spy.releaseConnection(connection);
      expect(spy.calls.releaseConnection).toBe(1);

      await spy.releaseConnection(connection);
      expect(spy.calls.releaseConnection).toBe(2);
    });

    it("destroy呼び出しを記録する", async () => {
      const spy = new SpyDatabaseConnectionProvider(config);

      expect(spy.calls.destroy).toBe(0);

      await spy.destroy();
      expect(spy.calls.destroy).toBe(1);
    });

    it("呼び出し記録をリセットできる", async () => {
      const spy = new SpyDatabaseConnectionProvider(config);
      await spy.getConnection();
      await spy.getConnection();

      expect(spy.calls.getConnection).toBe(2);

      spy.resetCalls();

      expect(spy.calls.getConnection).toBe(0);
      expect(spy.calls.releaseConnection).toBe(0);
      expect(spy.calls.destroy).toBe(0);
    });
  });

  describe("基本機能", () => {
    it("MockDatabaseConnectionProviderと同じ基本機能を持つ", async () => {
      const spy = new SpyDatabaseConnectionProvider(config);

      expect(spy.isInitialized()).toBe(true);

      const connection = await spy.getConnection();
      expect(connection.isConnected()).toBe(true);

      const retrievedConfig = spy.getConfig();
      expect(retrievedConfig).toEqual(config);

      await spy.destroy();
      expect(spy.isInitialized()).toBe(false);
    });
  });
});
