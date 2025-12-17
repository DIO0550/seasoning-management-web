import type {
  IDatabaseConnection,
  IDatabaseConnectionProvider,
  ConnectionConfig,
  QueryResult,
  ITransaction,
} from "@/libs/database/interfaces/core";

/**
 * テスト用のモックデータベース接続
 */
export class MockDatabaseConnection implements IDatabaseConnection {
  private _isConnected = false;
  private readonly _config: ConnectionConfig;

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
      throw new Error("Not connected");
    }
    return {
      rows: [] as T[],
      rowsAffected: 0,
      insertId: null,
    };
  }

  async beginTransaction(): Promise<ITransaction> {
    if (!this._isConnected) {
      throw new Error("Not connected");
    }
    return new MockTransaction();
  }

  async ping(): Promise<boolean> {
    return this._isConnected;
  }

  getConfig(): ConnectionConfig {
    return { ...this._config };
  }
}

/**
 * テスト用のモックトランザクション
 */
class MockTransaction implements ITransaction {
  private status: "ACTIVE" | "COMMITTED" | "ROLLED_BACK" = "ACTIVE";

  async query<T = unknown>(
    _sql: string,
    _params?: unknown[]
  ): Promise<QueryResult<T>> {
    return {
      rows: [] as T[],
      rowsAffected: 0,
      insertId: null,
    };
  }

  async commit(): Promise<void> {
    this.status = "COMMITTED";
  }

  async rollback(): Promise<void> {
    this.status = "ROLLED_BACK";
  }

  getStatus() {
    return this.status;
  }

  isActive(): boolean {
    return this.status === "ACTIVE";
  }
}

/**
 * テスト用のモックデータベース接続プロバイダ
 *
 * @example
 * ```typescript
 * const provider = new MockDatabaseConnectionProvider({
 *   host: "localhost",
 *   port: 3306,
 *   database: "test_db",
 *   username: "test_user",
 * });
 *
 * const connection = await provider.getConnection();
 * // テストでの使用...
 * await provider.releaseConnection(connection);
 * ```
 */
export class MockDatabaseConnectionProvider
  implements IDatabaseConnectionProvider
{
  private readonly config: ConnectionConfig;
  private connection: MockDatabaseConnection | null = null;
  private _isInitialized = false;

  constructor(config: ConnectionConfig) {
    this.config = config;
    this._isInitialized = true;
  }

  async getConnection(): Promise<IDatabaseConnection> {
    if (!this.connection) {
      this.connection = new MockDatabaseConnection(this.config);
      await this.connection.connect();
    }
    return this.connection;
  }

  async releaseConnection(_connection: IDatabaseConnection): Promise<void> {
    // モックでは何もしない
  }

  isInitialized(): boolean {
    return this._isInitialized;
  }

  getConfig(): ConnectionConfig {
    return { ...this.config };
  }

  async destroy(): Promise<void> {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
    }
    this._isInitialized = false;
  }
}

/**
 * テスト用のスパイ機能付きデータベース接続プロバイダ
 * メソッド呼び出しの記録を保持します
 */
export class SpyDatabaseConnectionProvider
  implements IDatabaseConnectionProvider
{
  private readonly config: ConnectionConfig;
  private connection: MockDatabaseConnection | null = null;
  private _isInitialized = false;

  // スパイ用の呼び出し記録
  public readonly calls = {
    getConnection: 0,
    releaseConnection: 0,
    destroy: 0,
  };

  constructor(config: ConnectionConfig) {
    this.config = config;
    this._isInitialized = true;
  }

  async getConnection(): Promise<IDatabaseConnection> {
    this.calls.getConnection++;
    if (!this.connection) {
      this.connection = new MockDatabaseConnection(this.config);
      await this.connection.connect();
    }
    return this.connection;
  }

  async releaseConnection(_connection: IDatabaseConnection): Promise<void> {
    this.calls.releaseConnection++;
  }

  isInitialized(): boolean {
    return this._isInitialized;
  }

  getConfig(): ConnectionConfig {
    return { ...this.config };
  }

  async destroy(): Promise<void> {
    this.calls.destroy++;
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
    }
    this._isInitialized = false;
  }

  /**
   * スパイの呼び出し記録をリセット
   */
  resetCalls(): void {
    this.calls.getConnection = 0;
    this.calls.releaseConnection = 0;
    this.calls.destroy = 0;
  }
}
