import type {
  QueryResult,
  ConnectionConfig,
  PoolStats,
} from "./i-database-connection";

/**
 * データベース接続アダプターの基本インターフェース
 * 具体的なDBライブラリとの境界線を定義（トランザクション操作を含まない）
 */
export interface IConnectionAdapter {
  /**
   * SQLクエリを実行する
   */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;

  /**
   * トランザクションを開始する
   */
  beginTransaction(): Promise<ITransactionAdapter>;

  /**
   * データベース接続の生存確認を行う
   */
  ping(): Promise<void>;

  /**
   * 接続を終了する
   */
  end(): Promise<void>;

  /**
   * 接続設定を取得する
   */
  getConfig(): ConnectionConfig;

  /**
   * 接続プールの統計情報を取得する
   */
  getStats(): PoolStats;
}

/**
 * トランザクション用インターフェース
 * 基本的なクエリ操作とトランザクション固有の操作のみを提供
 */
export interface ITransactionAdapter {
  /**
   * SQLクエリを実行する
   */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;

  /**
   * トランザクションをコミットする
   */
  commit(): Promise<void>;

  /**
   * トランザクションをロールバックする
   */
  rollback(): Promise<void>;

  /**
   * 接続を終了する
   */
  end(): Promise<void>;
}
