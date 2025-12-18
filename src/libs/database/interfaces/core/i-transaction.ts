import type { QueryResult, TransactionStatus } from "./i-database-connection";

/**
 * データベーストランザクションのインターフェース
 * クリーンアーキテクチャに基づき、具体的なDB実装に依存しない抽象的なトランザクション操作を定義
 */
export interface ITransaction {
  /**
   * トランザクション内でSQLクエリを実行する
   * @param sql 実行するSQL文
   * @param params パラメータ
   * @returns クエリ結果
   * @throws {TransactionError} クエリ実行に失敗した場合
   */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;

  /**
   * トランザクションをコミットする
   * @throws {TransactionError} コミットに失敗した場合
   */
  commit(): Promise<void>;

  /**
   * トランザクションをロールバックする
   * @throws {TransactionError} ロールバックに失敗した場合
   */
  rollback(): Promise<void>;

  /**
   * トランザクションの状態を取得する
   * @returns 現在のトランザクション状態
   */
  getStatus(): TransactionStatus;

  /**
   * トランザクションが有効かどうかを確認する
   * @returns 有効な場合はtrue
   */
  isActive(): boolean;
}
