import type {
  ConnectionConfig,
  QueryResult,
  PoolStats,
} from "./i-database-connection";
import type { IDatabaseConnection } from "./i-database-connection";

/**
 * データベースプールの抽象インターフェース
 */
export interface IDatabasePool {
  /**
   * SQLクエリを実行する
   */
  execute<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>>;

  /**
   * 接続プールから単一の接続を取得する
   */
  getConnection(): Promise<IDatabaseConnection>;

  /**
   * データベース接続の生存確認を行う
   */
  ping(): Promise<void>;

  /**
   * 接続プールを終了する
   */
  end(): Promise<void>;

  /**
   * 接続プールの統計情報を取得する
   */
  getStats(): PoolStats | null;

  /**
   * 接続設定を取得する
   */
  getConfig(): ConnectionConfig;
}
