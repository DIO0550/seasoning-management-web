import { describe, test, expect } from "vitest";
import type {
  IDatabaseConnection,
  QueryResult,
  ConnectionConfig,
} from "./IDatabaseConnection";
import type { ITransaction } from "./ITransaction";

// テスト用のモック実装
class MockDatabaseConnection implements IDatabaseConnection {
  private _isConnected = false;
  private _config: ConnectionConfig;

  constructor(config: ConnectionConfig) {
    this._config = config;
  }

  async connect(): Promise<void> {
    this._isConnected = true;
  }

  async disconnect(): Promise<void> {
    this._isConnected = false;
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  async query<T = unknown>(
    _sql: string,
    _params?: unknown[]
  ): Promise<QueryResult<T>> {
    if (!this._isConnected) {
      throw new Error("Database is not connected");
    }

    // モックレスポンス
    return {
      rows: [] as T[],
      rowsAffected: 0,
      insertId: null,
    };
  }

  async beginTransaction(): Promise<ITransaction> {
    if (!this._isConnected) {
      throw new Error("Database is not connected");
    }

    // モックトランザクション
    return {
      query: async <T = unknown>(): Promise<QueryResult<T>> => ({
        rows: [] as T[],
        rowsAffected: 0,
        insertId: null,
        metadata: {},
      }),
      commit: async () => {},
      rollback: async () => {},
    };
  }

  async ping(): Promise<boolean> {
    return this._isConnected;
  }

  getConfig(): ConnectionConfig {
    return { ...this._config };
  }
}

describe("IDatabaseConnection", () => {
  const mockConfig: ConnectionConfig = {
    host: "localhost",
    port: 3306,
    database: "test_db",
    username: "test_user",
    password: "test_password",
  };

  test("データベースに接続できる", async () => {
    const connection = new MockDatabaseConnection(mockConfig);

    expect(connection.isConnected()).toBe(false);

    await connection.connect();

    expect(connection.isConnected()).toBe(true);
  });

  test("データベースから切断できる", async () => {
    const connection = new MockDatabaseConnection(mockConfig);

    await connection.connect();
    expect(connection.isConnected()).toBe(true);

    await connection.disconnect();

    expect(connection.isConnected()).toBe(false);
  });

  test("クエリを実行できる", async () => {
    const connection = new MockDatabaseConnection(mockConfig);
    await connection.connect();

    const result = await connection.query("SELECT * FROM users");

    expect(result).toHaveProperty("rows");
    expect(result).toHaveProperty("rowsAffected");
    expect(result).toHaveProperty("insertId");
    expect(Array.isArray(result.rows)).toBe(true);
  });

  test("パラメータ付きクエリを実行できる", async () => {
    const connection = new MockDatabaseConnection(mockConfig);
    await connection.connect();

    const result = await connection.query("SELECT * FROM users WHERE id = ?", [
      1,
    ]);

    expect(result).toHaveProperty("rows");
    expect(result).toHaveProperty("rowsAffected");
    expect(result).toHaveProperty("insertId");
  });

  test("未接続状態でクエリを実行するとエラーが発生する", async () => {
    const connection = new MockDatabaseConnection(mockConfig);

    await expect(connection.query("SELECT 1")).rejects.toThrow(
      "Database is not connected"
    );
  });

  test("トランザクションを開始できる", async () => {
    const connection = new MockDatabaseConnection(mockConfig);
    await connection.connect();

    const transaction = await connection.beginTransaction();

    expect(transaction).toHaveProperty("query");
    expect(transaction).toHaveProperty("commit");
    expect(transaction).toHaveProperty("rollback");
  });

  test("未接続状態でトランザクションを開始するとエラーが発生する", async () => {
    const connection = new MockDatabaseConnection(mockConfig);

    await expect(connection.beginTransaction()).rejects.toThrow(
      "Database is not connected"
    );
  });

  test("接続状態を確認できる（ping）", async () => {
    const connection = new MockDatabaseConnection(mockConfig);

    expect(await connection.ping()).toBe(false);

    await connection.connect();

    expect(await connection.ping()).toBe(true);
  });

  test("設定情報を取得できる", () => {
    const connection = new MockDatabaseConnection(mockConfig);

    const config = connection.getConfig();

    expect(config).toEqual(mockConfig);
    expect(config).not.toBe(mockConfig); // コピーが返されることを確認
  });
});
