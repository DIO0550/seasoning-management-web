/**
 * Infrastructure層のサービス識別子定義
 * @description インフラストラクチャの具象実装をバインドするための識別子
 */

import type { ServiceIdentifier } from "./types";
import type { IDatabaseConnectionProvider } from "@/infrastructure/database/interfaces";
import type { RepositoryFactory } from "./RepositoryFactory";

/**
 * Infrastructure層のサービス識別子
 */
export const INFRASTRUCTURE_IDENTIFIERS = {
  // データベース接続プロバイダー
  DATABASE_CONNECTION_PROVIDER: Symbol(
    "DatabaseConnectionProvider"
  ) as ServiceIdentifier<IDatabaseConnectionProvider>,

  // リポジトリファクトリー
  // Note: 個別のリポジトリではなく、ファクトリーを登録
  REPOSITORY_FACTORY: Symbol(
    "RepositoryFactory"
  ) as ServiceIdentifier<RepositoryFactory>,
} as const;
