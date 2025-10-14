/**
 * DIライブラリのエクスポート
 * @description 依存注入ライブラリの公開API
 *
 * このモジュールはDomain層の抽象化を提供します。
 * 具体的なバインディングと実装は `@/infrastructure/di` を使用してください。
 *
 * 使用方法:
 * ```typescript
 * import { DIContainer } from "@/libs/di"; // ドメイン層の抽象化
 * import { configureInfrastructureForDevelopment } from "@/infrastructure/di"; // Infrastructure層の実装
 * ```
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
