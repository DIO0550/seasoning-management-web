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

// インターフェース定義（タイプのみ）
export type {
  IDatabaseConnection,
  QueryResult,
  ConnectionConfig,
  IConnectionPool,
  PoolStats,
} from "./IDatabaseConnection";

export type { ITransaction, TransactionOptions } from "./ITransaction";

// エラー型の型定義も再エクスポート
export type { DatabaseErrorCode } from "./types/DatabaseErrors";

// 共通型定義
export type * from "./common/types";

// リポジトリインターフェース
export type * from "./ISeasoningRepository";
export type * from "./ISeasoningTypeRepository";
export type * from "./ISeasoningImageRepository";
export type * from "./ISeasoningTemplateRepository";
