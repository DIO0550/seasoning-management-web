import * as mysql from "mysql2/promise";
import type { IDatabaseConnection } from "../../interfaces/IDatabaseConnection";
import type { ITransaction } from "../../interfaces/ITransaction";
import type {
  ConnectionConfig,
  QueryResult,
  TransactionOptions,
} from "@/infrastructure/database/interfaces";
import { ConnectionError, QueryError, TransactionError } from "../../errors";
import { MySQLTransaction } from "./MySQLTransaction";

/**
 * MySQL データベース接続の実装
 */
export class MySQLConnection implements IDatabaseConnection {
  private connection: mysql.Connection | null = null;
  private config: ConnectionConfig;
  private isConnectedFlag = false;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  /**
   * データベースに接続する
   */
  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database,
        connectTimeout: this.config.connectTimeout,
      });

      this.isConnectedFlag = true;
    } catch (error) {
      throw new ConnectionError(
        `Failed to connect to database: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { config: { ...this.config, password: "[REDACTED]" } }
      );
    }
  }

  /**
   * データベースから切断する
   */
  async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.end();
        this.connection = null;
        this.isConnectedFlag = false;
      }
    } catch (error) {
      throw new ConnectionError(
        `Failed to disconnect from database: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 接続状態を確認する
   */
  isConnected(): boolean {
    return this.isConnectedFlag && this.connection !== null;
  }

  /**
   * SQLクエリを実行する
   */
  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    if (!this.connection) {
      throw new QueryError(
        "Database connection is not established",
        sql,
        params
      );
    }

    try {
      const [rows, fields] = await this.connection.execute(sql, params);

      return this.formatQueryResult<T>(rows, fields);
    } catch (error) {
      throw new QueryError(
        `Query execution failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        sql,
        params,
        { error }
      );
    }
  }

  /**
   * トランザクションを開始する
   */
  async beginTransaction(options?: TransactionOptions): Promise<ITransaction> {
    if (!this.connection) {
      throw new TransactionError("Database connection is not established");
    }

    try {
      await this.connection.beginTransaction();

      // 分離レベルの設定
      if (options?.isolationLevel) {
        const isolationLevelSQL = `SET TRANSACTION ISOLATION LEVEL ${options.isolationLevel.replace(
          "_",
          " "
        )}`;
        await this.connection.execute(isolationLevelSQL);
      }

      return new MySQLTransaction(this.connection);
    } catch (error) {
      throw new TransactionError(
        `Failed to begin transaction: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { options }
      );
    }
  }

  /**
   * 接続の健全性をチェックする
   */
  async ping(): Promise<boolean> {
    if (!this.connection) {
      return false;
    }

    try {
      await this.connection.ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 接続設定を取得する
   */
  getConfig(): ConnectionConfig {
    return { ...this.config, password: "[REDACTED]" };
  }

  /**
   * クエリ結果をフォーマットする
   */
  private formatQueryResult<T>(
    rows: unknown,
    fields?: unknown
  ): QueryResult<T> {
    // MySQL2の結果を共通のQueryResult形式に変換
    if (Array.isArray(rows)) {
      const mysqlResult = rows as mysql.RowDataPacket[] & mysql.ResultSetHeader;
      return {
        rows: rows as T[],
        rowsAffected: mysqlResult.affectedRows || rows.length,
        insertId: mysqlResult.insertId ?? null,
        metadata: { fields },
      };
    }

    // INSERT/UPDATE/DELETE等の場合
    const result = rows as mysql.ResultSetHeader;
    return {
      rows: [] as T[],
      rowsAffected: result.affectedRows || 0,
      insertId: result.insertId ?? null,
      metadata: { fields },
    };
  }
}
