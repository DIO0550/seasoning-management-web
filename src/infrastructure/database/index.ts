/**
 * インフラストラクチャ層のデータベース関連エクスポート
 * クリーンアーキテクチャに基づくデータベース抽象化層
 */

// 共通型定義
export type * from "./shared";

// インターフェース定義（コアの型を再エクスポート）
export type {
  IDatabaseConnection,
  ITransaction,
} from "@/infrastructure/database/interfaces";
export type {
  IConnectionPool,
  PoolStats,
  PoolEventHandlers,
} from "./interfaces/IConnectionPool";
export type {
  IDatabaseFactory,
  DatabaseType,
} from "./interfaces/IDatabaseFactory";

// エラー型定義（値とタイプの両方をエクスポート）
export {
  DatabaseError,
  ConnectionError,
  TransactionError,
  QueryError,
  ConfigurationError,
  TimeoutError,
  PoolError,
  DATABASE_ERROR_CODES,
  isDatabaseError,
  isConnectionError,
  isTransactionError,
  isQueryError,
  isConfigurationError,
  isTimeoutError,
  isPoolError,
} from "./errors";

// エラー型の型定義も再エクスポート
export type { DatabaseErrorCode } from "./errors";

// MySQL 実装
export * from "./mysql";

// データベースファクトリー
export {
  DatabaseFactory,
  databaseFactory,
  SUPPORTED_DATABASE_TYPES,
} from "./DatabaseFactory";

// コネクションマネージャー
export { ConnectionManager } from "./ConnectionManager";
export type { ConnectionManagerOptions } from "./ConnectionManager";
