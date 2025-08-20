/**
 * データベースインターフェース型定義のエクスポート
 * クリーンアーキテクチャに基づいたデータベース抽象化層
 */

// エラー型定義（値とタイプの両方をエクスポート）
export {
  DatabaseError,
  ConnectionError,
  TransactionError,
  QueryError,
  DATABASE_ERROR_CODES,
  isDatabaseError,
  isConnectionError,
  isTransactionError,
  isQueryError,
} from "./types/DatabaseErrors";

// エラー型の型定義も再エクスポート
export type { DatabaseErrorCode } from "./types/DatabaseErrors";

// 共通型定義
export type * from "./common/types";

// データベースコア機能
export type * from "./core";

// リポジトリインターフェース
export type * from "./repositories";
