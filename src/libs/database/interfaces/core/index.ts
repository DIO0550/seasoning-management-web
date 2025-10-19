/**
 * データベースコア機能のインターフェース
 * データベース接続、プール、トランザクション等の基本機能
 */

// データベース接続関連
export type {
  IDatabaseConnection,
  QueryResult,
  ConnectionConfig,
  IConnectionPool,
  PoolStats,
  PoolConfig,
  TransactionOptions,
  IsolationLevel,
  TransactionStatus,
} from "./IDatabaseConnection";

// 接続プロバイダ
export type { IDatabaseConnectionProvider } from "./IDatabaseConnectionProvider";

// データベースプール
export type { IDatabasePool } from "./IDatabasePool";

// 接続アダプター
export type { IConnectionAdapter } from "./IConnectionAdapter";

// トランザクション
export type { ITransaction } from "./ITransaction";
