/**
 * Infrastructure層のサービス識別子定義
 * @description インフラストラクチャの具象実装をバインドするための識別子
 */

import type { ServiceIdentifier } from "./types";
import type { IDatabaseConnectionProvider } from "@/infrastructure/database/interfaces";
import type { RepositoryFactory } from "./repository-factory";
import type { CreateSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/create-seasoning-type";
import type { DeleteSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/delete-seasoning-type";

/**
 * Infrastructure層のサービス識別子
 */
export const INFRASTRUCTURE_IDENTIFIERS = {
  // データベース接続プロバイダー
  DATABASE_CONNECTION_PROVIDER: Symbol(
    "DatabaseConnectionProvider",
  ) as ServiceIdentifier<IDatabaseConnectionProvider>,

  // リポジトリファクトリー
  // Note: 個別のリポジトリではなく、ファクトリーを登録
  REPOSITORY_FACTORY: Symbol(
    "repository-factory",
  ) as ServiceIdentifier<RepositoryFactory>,

  CREATE_SEASONING_TYPE_USE_CASE: Symbol(
    "create-seasoning-type-use-case",
  ) as ServiceIdentifier<CreateSeasoningTypeUseCase>,

  DELETE_SEASONING_TYPE_USE_CASE: Symbol(
    "delete-seasoning-type-use-case",
  ) as ServiceIdentifier<DeleteSeasoningTypeUseCase>,
} as const;
