import type { Connection } from "mysql2/promise";
import type {
  IConnectionAdapter,
  ITransactionAdapter,
} from "@/infrastructure/database/interfaces/IConnectionAdapter";
import type {
  ConnectionConfig,
  PoolStats,
  QueryResult,
} from "@/infrastructure/database/interfaces";
import { MySQL2TransactionAdapter } from "./MySQL2TransactionAdapter";

/**
 * MySQL2ライブラリのConnectionを単純にラップするアダプター
 */
export class MySQL2ConnectionAdapter implements IConnectionAdapter {
  constructor(protected readonly _connection: Connection) {}

  /**
   * SQLクエリを実行する（Connectionのクエリをそのまま使用）
   */
  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    const [rows] = await this._connection.execute(sql, params);
    const affectedRows = (rows as { affectedRows?: number })?.affectedRows;

    return {
      rows: (rows as T[]) || [],
      rowsAffected: typeof affectedRows === "number" ? affectedRows : 0,
      insertId: (rows as { insertId?: number })?.insertId || null,
    };
  }

  /**
   * トランザクションを開始する
   */
  async beginTransaction(): Promise<ITransactionAdapter> {
    await this._connection.beginTransaction();
    return new MySQL2TransactionAdapter(this._connection);
  }

  /**
   * データベース接続の生存確認
   */
  async ping(): Promise<void> {
    await this._connection.query("SELECT 1");
  }

  /**
   * 接続を終了する
   */
  async end(): Promise<void> {
    await this._connection.end();
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
