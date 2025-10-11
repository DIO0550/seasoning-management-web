import * as mysql from "mysql2/promise";
import type {
  IConnectionPool,
  PoolStats,
  PoolEventHandlers,
} from "../../interfaces/IConnectionPool";
import type { IDatabaseConnection } from "../../interfaces/IDatabaseConnection";
import type { ITransaction } from "../../interfaces/ITransaction";
import type {
  ConnectionConfig,
  PoolConfig,
  QueryResult,
  TransactionOptions,
} from "@/libs/database/interfaces/core";
import { PoolError, ConnectionError } from "../../errors";

/**
 * MySQL コネクションプールの実装
 */
export class MySQLConnectionPool implements IConnectionPool {
  private pool: mysql.Pool | null = null;
  private config: ConnectionConfig | null = null;
  private eventHandlers: PoolEventHandlers = {};
  private stats: PoolStats;

  constructor(eventHandlers?: PoolEventHandlers) {
    this.eventHandlers = eventHandlers || {};
    this.stats = {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      pendingRequests: 0,
      acquiredConnections: 0,
      createdAt: new Date(),
      lastActivity: new Date(),
      errors: {
        connectionErrors: 0,
        timeoutErrors: 0,
        otherErrors: 0,
      },
    };
  }

  /**
   * プールを初期化する
   */
  async initialize(config: ConnectionConfig): Promise<void> {
    try {
      this.config = config;

      const poolConfig: mysql.PoolOptions = {
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
        connectTimeout: config.connectTimeout,
        connectionLimit: config.pool?.max || 10,
      };

      this.pool = mysql.createPool(poolConfig);

      // 初期接続テスト
      await this.testConnection();
    } catch (error) {
      throw new PoolError(
        `Failed to initialize connection pool: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { config: { ...config, password: "[REDACTED]" } }
      );
    }
  }

  /**
   * プールから接続を取得する
   */
  async acquire(): Promise<IDatabaseConnection> {
    if (!this.pool) {
      throw new PoolError("Connection pool is not initialized");
    }

    try {
      const connection = await this.pool.getConnection();
      this.stats.acquiredConnections++;
      this.stats.lastActivity = new Date();

      // ラップした接続オブジェクトを作成
      const wrappedConnection = new PooledMySQLConnection(connection, this);

      this.eventHandlers.onAcquire?.(wrappedConnection);

      return wrappedConnection;
    } catch (error) {
      this.stats.errors.connectionErrors++;
      throw new PoolError(
        `Failed to acquire connection from pool: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { error }
      );
    }
  }

  /**
   * 接続をプールに返却する
   */
  async release(connection: IDatabaseConnection): Promise<void> {
    try {
      if (connection instanceof PooledMySQLConnection) {
        connection.release();
        this.stats.lastActivity = new Date();
        this.eventHandlers.onRelease?.(connection);
      }
    } catch (error) {
      this.stats.errors.otherErrors++;
      throw new PoolError(
        `Failed to release connection to pool: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { error }
      );
    }
  }

  /**
   * プールを破棄する
   */
  async destroy(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
      }
    } catch (error) {
      throw new PoolError(
        `Failed to destroy connection pool: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * プールの統計情報を取得する
   */
  getStats(): PoolStats {
    return { ...this.stats };
  }

  /**
   * プールの健全性をチェックする
   */
  isHealthy(): boolean {
    return this.pool !== null;
  }

  /**
   * プール設定を取得する
   */
  getConfig(): PoolConfig {
    const defaultConfig: PoolConfig = {
      min: 0,
      max: 10,
      acquireTimeout: 30000,
      createTimeout: 30000,
      destroyTimeout: 5000,
      idle: 600000,
      reapInterval: 1000,
    };

    if (!this.config?.pool) {
      return defaultConfig;
    }

    return {
      min: this.config.pool.min ?? defaultConfig.min,
      max: this.config.pool.max ?? defaultConfig.max,
      acquireTimeout:
        this.config.pool.acquireTimeout ?? defaultConfig.acquireTimeout,
      createTimeout:
        this.config.pool.createTimeout ?? defaultConfig.createTimeout,
      destroyTimeout:
        this.config.pool.destroyTimeout ?? defaultConfig.destroyTimeout,
      idle: this.config.pool.idle ?? defaultConfig.idle,
      reapInterval: this.config.pool.reapInterval ?? defaultConfig.reapInterval,
    };
  }

  /**
   * 初期接続テストを実行する
   */
  private async testConnection(): Promise<void> {
    if (!this.pool) return;

    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
    } catch (error) {
      throw new ConnectionError(
        `Connection test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

/**
 * プールから取得した接続のラッパークラス
 */
class PooledMySQLConnection implements IDatabaseConnection {
  private connection: mysql.PoolConnection;
  private pool: MySQLConnectionPool;

  constructor(connection: mysql.PoolConnection, pool: MySQLConnectionPool) {
    this.connection = connection;
    this.pool = pool;
  }

  async connect(): Promise<void> {
    // プール接続では不要
  }

  async disconnect(): Promise<void> {
    this.release();
  }

  isConnected(): boolean {
    return this.connection !== null;
  }

  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    try {
      const [rows, fields] = await this.connection.execute(sql, params);
      return this.formatQueryResult<T>(rows, fields);
    } catch (error) {
      throw error;
    }
  }

  async beginTransaction(_options?: TransactionOptions): Promise<ITransaction> {
    // TODO: Implement transaction support for pooled connections. See issue #123.
    throw new Error("Transaction not implemented for pooled connections");
  }

  async ping(): Promise<boolean> {
    try {
      await this.connection.ping();
      return true;
    } catch {
      return false;
    }
  }

  getConfig(): ConnectionConfig {
    // プール接続の場合は基本設定を返す
    return {
      host: "localhost",
      port: 3306,
      database: "",
      username: "",
      maxConnections: 10,
      minConnections: 0,
    };
  }

  /**
   * 接続をプールに返却する
   */
  release(): void {
    this.connection.release();
  }

  /**
   * クエリ結果をフォーマットする
   */
  private formatQueryResult<T>(
    rows: unknown,
    fields?: unknown
  ): QueryResult<T> {
    if (Array.isArray(rows)) {
      const mysqlResult = rows as mysql.RowDataPacket[] & mysql.ResultSetHeader;
      return {
        rows: rows as T[],
        rowsAffected: mysqlResult.affectedRows || rows.length,
        insertId: mysqlResult.insertId || null,
        metadata: { fields },
      };
    }

    const result = rows as mysql.ResultSetHeader;
    return {
      rows: [] as T[],
      rowsAffected: result.affectedRows || 0,
      insertId: result.insertId || null,
      metadata: { fields },
    };
  }
}
