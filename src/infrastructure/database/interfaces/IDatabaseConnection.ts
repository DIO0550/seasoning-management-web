/**
 * インフラ層向けのデータベース接続インターフェース
 * ドメイン層（libs）で定義されている抽象化を再エクスポートする
 */

export type {
  IDatabaseConnection,
  QueryResult,
  ConnectionConfig,
  PoolConfig,
  TransactionOptions,
  IsolationLevel,
  TransactionStatus,
} from "@/libs/database/interfaces/core";
