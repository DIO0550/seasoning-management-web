/**
 * Infrastructure層のサービスバインディング設定
 * @description 新しいMySQL実装を使用したコンポジションルート
 */

import type { DIContainer } from "./container";
import { INFRASTRUCTURE_IDENTIFIERS } from "./identifiers";
import {
  createDevelopmentConnectionProvider,
  createProductionConnectionProvider,
  createTestConnectionProvider,
} from "./factories";
import { RepositoryFactory } from "./repository-factory";
import { ServiceLifetime } from "./types";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { MySQLUnitOfWork } from "@/infrastructure/database/unit-of-work/my-sql-unit-of-work";
import { CreateSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/create-seasoning-type";
import { DeleteSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/delete-seasoning-type";

/**
 * 開発環境用のバインディング設定
 * @param container DIコンテナ
 */
export const configureInfrastructureForDevelopment = async (
  container: DIContainer,
): Promise<void> => {
  // データベース接続プロバイダーの設定（非同期初期化）
  const connectionProvider = await createDevelopmentConnectionProvider();

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.DATABASE_CONNECTION_PROVIDER,
    () => connectionProvider,
  );

  // リポジトリファクトリーの登録
  const repositoryFactory = new RepositoryFactory(connectionProvider);

  container.register(INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY, () => {
    return repositoryFactory;
  });

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.CREATE_SEASONING_TYPE_USE_CASE,
    () => {
      const connectionManager = ConnectionManager.getInstance();
      const unitOfWork = new MySQLUnitOfWork(connectionManager);
      return new CreateSeasoningTypeUseCase(unitOfWork);
    },
    ServiceLifetime.TRANSIENT,
  );

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.DELETE_SEASONING_TYPE_USE_CASE,
    () => {
      const connectionManager = ConnectionManager.getInstance();
      const unitOfWork = new MySQLUnitOfWork(connectionManager);
      return new DeleteSeasoningTypeUseCase(unitOfWork);
    },
    ServiceLifetime.TRANSIENT,
  );
};

/**
 * 本番環境用のバインディング設定
 * @param container DIコンテナ
 */
export const configureInfrastructureForProduction = async (
  container: DIContainer,
): Promise<void> => {
  const connectionProvider = await createProductionConnectionProvider();

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.DATABASE_CONNECTION_PROVIDER,
    () => connectionProvider,
  );

  const repositoryFactory = new RepositoryFactory(connectionProvider);

  container.register(INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY, () => {
    return repositoryFactory;
  });

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.CREATE_SEASONING_TYPE_USE_CASE,
    () => {
      const connectionManager = ConnectionManager.getInstance();
      const unitOfWork = new MySQLUnitOfWork(connectionManager);
      return new CreateSeasoningTypeUseCase(unitOfWork);
    },
    ServiceLifetime.TRANSIENT,
  );

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.DELETE_SEASONING_TYPE_USE_CASE,
    () => {
      const connectionManager = ConnectionManager.getInstance();
      const unitOfWork = new MySQLUnitOfWork(connectionManager);
      return new DeleteSeasoningTypeUseCase(unitOfWork);
    },
    ServiceLifetime.TRANSIENT,
  );
};

/**
 * テスト環境用のバインディング設定
 * @param container DIコンテナ
 */
export const configureInfrastructureForTest = async (
  container: DIContainer,
): Promise<void> => {
  const connectionProvider = await createTestConnectionProvider();

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.DATABASE_CONNECTION_PROVIDER,
    () => connectionProvider,
  );

  const repositoryFactory = new RepositoryFactory(connectionProvider);

  container.register(INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY, () => {
    return repositoryFactory;
  });

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.CREATE_SEASONING_TYPE_USE_CASE,
    () => {
      const connectionManager = ConnectionManager.getInstance();
      const unitOfWork = new MySQLUnitOfWork(connectionManager);
      return new CreateSeasoningTypeUseCase(unitOfWork);
    },
    ServiceLifetime.TRANSIENT,
  );

  container.register(
    INFRASTRUCTURE_IDENTIFIERS.DELETE_SEASONING_TYPE_USE_CASE,
    () => {
      const connectionManager = ConnectionManager.getInstance();
      const unitOfWork = new MySQLUnitOfWork(connectionManager);
      return new DeleteSeasoningTypeUseCase(unitOfWork);
    },
    ServiceLifetime.TRANSIENT,
  );
};
