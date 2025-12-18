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
} from "./i-database-connection";

// 接続プロバイダ
export type { IDatabaseConnectionProvider } from "./i-database-connection-provider";

// データベースプール
export type { IDatabasePool } from "./i-database-pool";

// 接続アダプター
export type { IConnectionAdapter } from "./i-connection-adapter";

// トランザクション
export type { ITransaction } from "./i-transaction";
