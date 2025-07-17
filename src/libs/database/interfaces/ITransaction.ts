/**
 * データベーストランザクションのインターフェース
 * クリーンアーキテクチャに基づき、具体的なDB実装に依存しない抽象的なトランザクション操作を定義
 */
export interface ITransaction {
  /**
   * トランザクションを開始する
   * @throws {TransactionError} トランザクション開始に失敗した場合
   */
  begin(): Promise<void>;

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
   * トランザクションがアクティブかどうかを確認する
   * @returns トランザクションがアクティブな場合はtrue
   */
  isActive(): boolean;

  /**
   * トランザクションの一意識別子を取得する
   * @returns トランザクションID
   */
  getId(): string;
}

/**
 * トランザクション操作のオプション
 */
export interface TransactionOptions {
  /**
   * トランザクションのタイムアウト時間（ミリ秒）
   */
  timeout?: number;

  /**
   * 分離レベル
   */
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';

  /**
   * 読み取り専用トランザクションかどうか
   */
  readOnly?: boolean;
}

/**
 * トランザクション状態
 */
export type TransactionStatus = 
  | 'INACTIVE'    // 非アクティブ
  | 'ACTIVE'      // アクティブ
  | 'COMMITTED'   // コミット済み
  | 'ROLLED_BACK' // ロールバック済み
  | 'FAILED';     // 失敗
