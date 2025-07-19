import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { MySQLConnection } from "./MySQLConnection";
import type {
  ConnectionConfig,
  QueryResult,
  PoolStats,
} from "@/libs/database/interfaces/IDatabaseConnection";
import type { IConnectionAdapter, ITransactionAdapter } from "@/libs/database/interfaces/IConnectionAdapter";

describe("MySQLConnection", () => {
  let mockAdapter: IConnectionAdapter;
  let mockTransactionAdapter: ITransactionAdapter;
  let config: ConnectionConfig;
  let mysqlConnection: MySQLConnection;

  beforeEach(() => {
    config = {
      host: "localhost",
      port: 3306,
      database: "test_db",
      username: "test_user",
      password: "test_pass",
      maxConnections: 10,
      minConnections: 1,
      connectTimeout: 5000,
      queryTimeout: 10000,
    };

    // ITransactionAdapterのモック
    mockTransactionAdapter = {
      query: vi.fn().mockResolvedValue({
        rows: [],
        rowsAffected: 0,
        insertId: null,
      } as QueryResult<unknown>),
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn().mockResolvedValue(undefined),
      end: vi.fn().mockResolvedValue(undefined),
    } as ITransactionAdapter;

    // IConnectionAdapterのモックを作成
    mockAdapter = {
      query: vi.fn().mockResolvedValue({
        rows: [],
        rowsAffected: 0,
        insertId: null,
      } as QueryResult<unknown>),
      beginTransaction: vi.fn().mockResolvedValue(mockTransactionAdapter),
      ping: vi.fn().mockResolvedValue(undefined),
      end: vi.fn().mockResolvedValue(undefined),
      getConfig: vi.fn().mockReturnValue({
        ...config,
        password: "****", // パスワードマスキング
      }),
      getStats: vi.fn().mockReturnValue({
        totalConnections: 1,
        activeConnections: 0,
        idleConnections: 1,
        pendingRequests: 0,
      } as PoolStats),
    } as IConnectionAdapter;

    // 依存注入でモックAdapterを注入
    mysqlConnection = new MySQLConnection(mockAdapter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("connect", () => {
    test("データベースに接続できる", async () => {
      await mysqlConnection.connect();

      expect(mockAdapter.ping).toHaveBeenCalled();
      expect(mysqlConnection.isConnected()).toBe(true);
    });

    test("既に接続済みの場合は何もしない", async () => {
      await mysqlConnection.connect();
      vi.clearAllMocks(); // モックの呼び出し回数をリセット

      await mysqlConnection.connect(); // 2回目の呼び出し

      expect(mockAdapter.ping).not.toHaveBeenCalled(); // 既に接続済みなので ping は呼ばれない
      expect(mysqlConnection.isConnected()).toBe(true);
    });
  });

  describe("disconnect", () => {
    test("データベースから切断できる", async () => {
      // 接続状態にする
      await mysqlConnection.connect();

      await mysqlConnection.disconnect();

      expect(mockAdapter.end).toHaveBeenCalledOnce();
      expect(mysqlConnection.isConnected()).toBe(false);
    });

    test("未接続の場合は何もしない", async () => {
      await mysqlConnection.disconnect();

      expect(mockAdapter.end).not.toHaveBeenCalled();
      expect(mysqlConnection.isConnected()).toBe(false);
    });
  });

  describe("isConnected", () => {
    test("初期状態ではfalseを返す", () => {
      expect(mysqlConnection.isConnected()).toBe(false);
    });

    test("接続後はtrueを返す", async () => {
      await mysqlConnection.connect();
      expect(mysqlConnection.isConnected()).toBe(true);
    });

    test("切断後はfalseを返す", async () => {
      await mysqlConnection.connect();
      await mysqlConnection.disconnect();
      expect(mysqlConnection.isConnected()).toBe(false);
    });
  });

  describe("query", () => {
    beforeEach(async () => {
      // 接続状態にする
      await mysqlConnection.connect();
    });

    test("SQLクエリを実行できる", async () => {
      const mockResult: QueryResult<{ id: number; name: string }> = {
        rows: [{ id: 1, name: "test" }],
        rowsAffected: 1,
        insertId: null,
      };

      mockAdapter.query = vi.fn().mockResolvedValue(mockResult);

      const result = await mysqlConnection.query<{ id: number; name: string }>(
        "SELECT * FROM users WHERE id = ?",
        [1]
      );

      expect(result).toEqual(mockResult);
      expect(mockAdapter.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = ?",
        [1]
      );
    });

    test("パラメータなしのクエリを実行できる", async () => {
      const mockResult: QueryResult<{ count: number }> = {
        rows: [{ count: 5 }],
        rowsAffected: 1,
        insertId: null,
      };

      mockAdapter.query = vi.fn().mockResolvedValue(mockResult);

      const result = await mysqlConnection.query<{ count: number }>(
        "SELECT COUNT(*) as count FROM users"
      );

      expect(result.rows).toEqual([{ count: 5 }]);
      expect(mockAdapter.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) as count FROM users",
        undefined
      );
    });

    test("INSERT文の場合は挿入IDを返す", async () => {
      const mockResult: QueryResult<unknown> = {
        rows: [],
        rowsAffected: 1,
        insertId: 123,
      };

      mockAdapter.query = vi.fn().mockResolvedValue(mockResult);

      const result = await mysqlConnection.query(
        "INSERT INTO seasoning (name, type_id) VALUES (?, ?)",
        ["新しい調味料", 1]
      );

      expect(result.insertId).toBe(123);
      expect(result.rowsAffected).toBe(1);
      expect(mockAdapter.query).toHaveBeenCalledWith(
        "INSERT INTO seasoning (name, type_id) VALUES (?, ?)",
        ["新しい調味料", 1]
      );
    });

    test("未接続の場合はエラーを投げる", async () => {
      await mysqlConnection.disconnect();

      await expect(
        mysqlConnection.query("SELECT * FROM seasoning")
      ).rejects.toThrow("Not connected to database");
    });
  });

  describe("beginTransaction", () => {
    beforeEach(async () => {
      // 接続状態にする
      await mysqlConnection.connect();
    });

    test("トランザクションを開始できる", async () => {
      const transaction = await mysqlConnection.beginTransaction();

      expect(mockAdapter.beginTransaction).toHaveBeenCalledOnce();
      expect(transaction).toBeDefined();
      // MySQLTransactionはcommit, rollback, queryメソッドを持つ
      expect(typeof transaction.commit).toBe("function");
      expect(typeof transaction.rollback).toBe("function");
      expect(typeof transaction.query).toBe("function");
    });

    test("未接続の場合はエラーを投げる", async () => {
      await mysqlConnection.disconnect();

      await expect(mysqlConnection.beginTransaction()).rejects.toThrow(
        "Not connected to database"
      );
    });
  });

  describe("ping", () => {
    test("接続済みの場合はtrueを返す", async () => {
      await mysqlConnection.connect();
      vi.clearAllMocks(); // connectで呼ばれたpingをクリア

      const result = await mysqlConnection.ping();

      expect(mockAdapter.ping).toHaveBeenCalledOnce();
      expect(result).toBe(true);
    });

    test("未接続の場合でもpingを試行してtrueを返す", async () => {
      const result = await mysqlConnection.ping();

      expect(mockAdapter.ping).toHaveBeenCalledOnce();
      expect(result).toBe(true);
    });

    test("ping中にエラーが発生した場合はfalseを返す", async () => {
      await mysqlConnection.connect();
      mockAdapter.ping = vi.fn().mockRejectedValue(new Error("Connection lost"));

      const result = await mysqlConnection.ping();

      expect(result).toBe(false);
    });
  });

  describe("getConfig", () => {
    test("接続設定のコピーを返す", () => {
      const returnedConfig = mysqlConnection.getConfig();
      const expectedConfig = { ...config, password: "****" };

      expect(returnedConfig).toEqual(expectedConfig);
      expect(returnedConfig).not.toBe(config); // 異なるオブジェクトであることを確認
    });

    test("パスワードはマスクされる", () => {
      const returnedConfig = mysqlConnection.getConfig();

      expect(returnedConfig.password).toBe("****");
    });
  });

  describe("getStats", () => {
    test("コネクション統計を返す", () => {
      const stats = mysqlConnection.getStats();

      expect(mockAdapter.getStats).toHaveBeenCalledOnce();
      expect(stats).toEqual({
        totalConnections: 1,
        activeConnections: 0,
        idleConnections: 1,
        pendingRequests: 0,
      });
    });
  });

  describe("エラーハンドリング", () => {
    test("接続エラーが適切にハンドルされる", async () => {
      // モックadapterがエラーを投げるようにする
      const errorAdapter = {
        ...mockAdapter,
        ping: vi.fn().mockRejectedValue(new Error("Connection failed")),
      } as IConnectionAdapter;

      const newConnection = new MySQLConnection(errorAdapter);
      await expect(newConnection.connect()).rejects.toThrow(
        "Connection failed"
      );
    });

    test("クエリエラーが適切にハンドルされる", async () => {
      await mysqlConnection.connect();
      mockAdapter.query = vi.fn().mockRejectedValue(new Error("Query failed"));

      await expect(
        mysqlConnection.query("SELECT * FROM invalid_table")
      ).rejects.toThrow("Query failed");
    });
  });
});
