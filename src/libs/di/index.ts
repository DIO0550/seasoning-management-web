/**
 * DIライブラリのエクスポート
 * @description 依存注入ライブラリの公開API
 */

/**
 * DIライブラリのエクスポート
 * @description 依存注入ライブラリの公開API
 */

// 型定義
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

// DIコンテナ
export { DIContainer } from "./container";

// サービス識別子とバインディング
export { SERVICE_IDENTIFIERS } from "./bindings";
export {
  configureForDevelopment,
  configureForProduction,
  configureForTest,
} from "./bindings";

// 接続ファクトリー
export {
  createDevelopmentConnection,
  createProductionConnection,
  createTestConnection,
} from "./factories";

// 環境設定
export type { Environment as EnvironmentType } from "./config";
export {
  Environment,
  getCurrentEnvironment,
  createContainer,
  getContainer,
  resetContainer,
  initializeContainer,
} from "./config";
