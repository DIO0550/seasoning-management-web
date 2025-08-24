/**
 * データベーストランザクション関連の型定義
 */

/**
 * トランザクションオプション
 */
export interface TransactionOptions {
  /** 分離レベル */
  isolationLevel?: IsolationLevel;
  /** 読み取り専用フラグ */
  readOnly?: boolean;
  /** タイムアウト（ミリ秒） */
  timeout?: number;
}

/**
 * データベース分離レベル
 */
export type IsolationLevel =
  | "READ_UNCOMMITTED"
  | "READ_COMMITTED"
  | "REPEATABLE_READ"
  | "SERIALIZABLE";

/**
 * トランザクション状態
 */
export type TransactionStatus =
  | "PENDING" // 開始待ち
  | "ACTIVE" // 実行中
  | "COMMITTED" // コミット済み
  | "ROLLED_BACK" // ロールバック済み
  | "ERROR"; // エラー状態
