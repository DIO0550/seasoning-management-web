/**
 * データベースエラー関連のエクスポート
 * インフラストラクチャ層のエラーハンドリング
 */

// 基底エラークラスとコード定義
export {
  DatabaseError,
  DATABASE_ERROR_CODES,
  isDatabaseError,
} from "./database-error";
export type { DatabaseErrorCode } from "./database-error";

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
} from "./connection-errors";

// トランザクション関連エラー
export { TransactionError, isTransactionError } from "./transaction-errors";

// クエリ関連エラー
export { QueryError, isQueryError } from "./query-errors";
