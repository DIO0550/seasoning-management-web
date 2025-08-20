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
} from "./IDatabaseConnection";

// データベースプール
export type { IDatabasePool } from "./IDatabasePool";

// 接続アダプター
export type { IConnectionAdapter } from "./IConnectionAdapter";

// トランザクション
export type { ITransaction, TransactionOptions } from "./ITransaction";
