import type { Connection } from "mysql2/promise";
import type { ITransactionAdapter } from "@/libs/database/interfaces/IConnectionAdapter";
import type {
  QueryResult,
  ConnectionConfig,
  PoolStats,
} from "@/libs/database/interfaces";
import { createMySQLError } from "../errors";

/**
 * MySQL2ライブラリ用のトランザクションアダプター
 * mysql2のConnectionをラップしてITransactionAdapterインターフェースを実装
 */
export class MySQL2TransactionAdapter implements ITransactionAdapter {
  constructor(private readonly _connection: Connection) {}

  /**
   * SQLクエリを実行する
   */
  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    try {
      const [rows] = await this._connection.query(sql, params || []);

      // mysql2の結果をQueryResultに変換
      return {
        rows: Array.isArray(rows) ? (rows as T[]) : [],
        rowsAffected: (rows as { affectedRows?: number })?.affectedRows || 0,
        insertId: (rows as { insertId?: number })?.insertId || null,
      };
    } catch (error) {
      throw createMySQLError(error, "QUERY_ERROR");
    }
  }

  /**
   * トランザクションをコミットする
   */
  async commit(): Promise<void> {
    try {
      await this._connection.commit();
    } catch (error) {
      throw createMySQLError(error, "TRANSACTION_ERROR");
    }
  }

  /**
   * トランザクションをロールバックする
   */
  async rollback(): Promise<void> {
    try {
      await this._connection.rollback();
    } catch (error) {
      throw createMySQLError(error, "TRANSACTION_ERROR");
    }
  }

  /**
   * データベース接続の生存確認
   */
  async ping(): Promise<void> {
    try {
      await this._connection.query("SELECT 1");
    } catch (error) {
      throw createMySQLError(error, "CONNECTION_ERROR");
    }
  }

  /**
   * 接続を終了する（トランザクション中はエラー）
   */
  async end(): Promise<void> {
    throw new Error("Cannot close connection during transaction");
  }

  /**
   * 接続設定を取得する
   */
  getConfig(): ConnectionConfig {
    const config = this._connection.config;
    return {
      host: config.host || "localhost",
      port: config.port || 3306,
      database: config.database || "",
      username: config.user || "",
      password: "****", // マスク
      maxConnections: 1, // 単一接続なので1
      minConnections: 1,
      connectTimeout: config.connectTimeout || 60000,
      queryTimeout: 60000, // デフォルト値
    };
  }

  /**
   * 接続統計を取得する
   */
  getStats(): PoolStats {
    return {
      totalConnections: 1, // 単一接続なので1
      activeConnections: 1, // 接続が存在すれば1
      idleConnections: 0, // 単一接続では不適用
      pendingRequests: 0, // 単一接続では不適用
    };
  }
}
