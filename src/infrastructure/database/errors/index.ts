/**
 * データベースエラー関連のエクスポート
 * インフラストラクチャ層のエラーハンドリング
 */

// 基底エラークラスとコード定義
export {
  DatabaseError,
  DATABASE_ERROR_CODES,
  isDatabaseError,
} from "./DatabaseError";
export type { DatabaseErrorCode } from "./DatabaseError";

// 接続関連エラー
export {
  ConnectionError,
  ConfigurationError,
  TimeoutError,
  PoolError,
  isConnectionError,
  isConfigurationError,
  isTimeoutError,
  isPoolError,
} from "./ConnectionErrors";

// トランザクション関連エラー
export { TransactionError, isTransactionError } from "./TransactionErrors";

// クエリ関連エラー
export { QueryError, isQueryError } from "./QueryErrors";
