/**
 * Infrastructure層のDI（依存注入）エクスポート
 * @description コンポジションルートと公開API
 */

export { INFRASTRUCTURE_IDENTIFIERS } from "./identifiers";
export { RepositoryFactory } from "./RepositoryFactory";
export {
  configureInfrastructureForDevelopment,
  configureInfrastructureForProduction,
  configureInfrastructureForTest,
} from "./bindings";
export {
  createDevelopmentConnectionProvider,
  createProductionConnectionProvider,
  createTestConnectionProvider,
  createCustomConnectionProvider,
} from "./factories";

// DI コンテナ本体と型
export type {
  IDIContainer,
  ServiceIdentifier,
  ServiceFactory,
  ServiceLifetime as ServiceLifetimeType,
  ServiceRegistration,
} from "./types";
export {
  ServiceLifetime,
  ServiceNotFoundError,
  CircularDependencyError,
} from "./types";
export { DIContainer } from "./container";

// 環境設定ユーティリティ
export type { Environment as EnvironmentType } from "./config";
export {
  Environment,
  getCurrentEnvironment,
  createContainer,
  getContainer,
  resetContainer,
  initializeContainer,
} from "./config";
