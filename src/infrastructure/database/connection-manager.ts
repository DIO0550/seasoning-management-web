/**
 * コネクションマネージャー
 * データベース接続とコネクションプールを一元管理
 */

import type { IDatabaseFactory } from "./interfaces/i-database-factory";
import type { IConnectionPool } from "./interfaces/i-connection-pool";
import type { IDatabaseConnection } from "./interfaces/i-database-connection";
import type {
  ConnectionConfig,
  IDatabaseConnectionProvider,
} from "@/infrastructure/database/interfaces";
import { DatabaseFactory } from "./database-factory";
import { ConfigurationError, ConnectionError } from "./errors";

/**
 * コネクションマネージャーの設定オプション
 */
export interface ConnectionManagerOptions {
  /** コネクションプールを使用するかどうか */
  usePool?: boolean;
  /** データベースタイプ */
  databaseType?: "mysql" | "postgresql" | "sqlite" | "memory";
}

/**
 * コネクションマネージャーの実装
 * シングルトンパターンでコネクションプールを管理
 *
 * @implements {IDatabaseConnectionProvider}
 */
export class ConnectionManager implements IDatabaseConnectionProvider {
  private static instance: ConnectionManager | null = null;
  private pool: IConnectionPool | null = null;
  private singleConnection: IDatabaseConnection | null = null;
  private config: ConnectionConfig | null = null;
  private readonly factory: IDatabaseFactory;
  private readonly options: ConnectionManagerOptions;

  /**
   * プライベートコンストラクタ
   */
  private constructor(
    factory: IDatabaseFactory = new DatabaseFactory(),
    options: ConnectionManagerOptions = {}
  ) {
    this.factory = factory;
    this.options = {
      usePool: true,
      databaseType: "mysql",
      ...options,
    };
  }

  /**
   * インスタンスを取得する
   */
  static getInstance(
    factory?: IDatabaseFactory,
    options?: ConnectionManagerOptions
  ): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager(factory, options);
    }
    return ConnectionManager.instance;
  }

  /**
   * コネクションマネージャーを初期化する
   */
  async initialize(config: ConnectionConfig): Promise<void> {
    if (this.pool || this.singleConnection) {
      throw new ConfigurationError("Connection manager is already initialized");
    }

    this.config = config;
    const databaseType = this.options.databaseType || "mysql";

    if (this.options.usePool) {
      // プールモード
      this.pool = this.factory.createConnectionPool(databaseType, config);
      await this.pool.initialize(config);
    } else {
      // シングル接続モード
      this.singleConnection = this.factory.createConnection(
        databaseType,
        config
      );
      await this.singleConnection.connect();
    }
  }

  /**
   * 接続を取得する
   */
  async getConnection(): Promise<IDatabaseConnection> {
    if (!this.config) {
      throw new ConfigurationError("Connection manager is not initialized");
    }

    if (this.options.usePool && this.pool) {
      return await this.pool.acquire();
    }

    if (this.singleConnection) {
      if (!this.singleConnection.isConnected()) {
        await this.singleConnection.connect();
      }
      return this.singleConnection;
    }

    throw new ConnectionError("No connection available");
  }

  /**
   * 接続を返却する（プールモードの場合）
   */
  async releaseConnection(connection: IDatabaseConnection): Promise<void> {
    if (this.options.usePool && this.pool) {
      await this.pool.release(connection);
    }
    // シングル接続モードの場合は何もしない
  }

  /**
   * コネクションマネージャーを破棄する
   */
  async destroy(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.destroy();
        this.pool = null;
      }

      if (this.singleConnection) {
        await this.singleConnection.disconnect();
        this.singleConnection = null;
      }

      this.config = null;
    } catch (error) {
      throw new ConnectionError(
        `Failed to destroy connection manager: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * プールの統計情報を取得する
   */
  getPoolStats() {
    if (this.pool) {
      return this.pool.getStats();
    }
    return null;
  }

  /**
   * 接続状態を確認する
   */
  isInitialized(): boolean {
    return this.pool !== null || this.singleConnection !== null;
  }

  /**
   * 接続設定を取得する
   */
  getConfig(): ConnectionConfig {
    if (!this.config) {
      throw new ConfigurationError("Connection manager is not initialized");
    }
    return { ...this.config };
  }

  /**
   * テスト用：インスタンスをリセットする
   */
  static resetForTesting(): void {
    if (process.env.NODE_ENV === "test") {
      ConnectionManager.instance = null;
    }
  }
}
