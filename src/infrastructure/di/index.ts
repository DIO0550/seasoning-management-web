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
