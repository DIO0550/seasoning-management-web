/**
 * DI 初期化ユーティリティ
 * @description 旧 libs/di から移設し、Infrastructure バインディングに対応
 */

import { DIContainer } from "./container";
import {
  configureInfrastructureForDevelopment,
  configureInfrastructureForProduction,
  configureInfrastructureForTest,
} from "./bindings";

export const Environment = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type Environment = (typeof Environment)[keyof typeof Environment];

export const getCurrentEnvironment = (): Environment => {
  const nodeEnv = process.env.NODE_ENV || "development";

  switch (nodeEnv) {
    case "production":
      return Environment.PRODUCTION;
    case "test":
      return Environment.TEST;
    default:
      return Environment.DEVELOPMENT;
  }
};

export const createContainer = async (
  environment?: Environment
): Promise<DIContainer> => {
  const env = environment || getCurrentEnvironment();
  const container = new DIContainer();

  switch (env) {
    case Environment.PRODUCTION:
      await configureInfrastructureForProduction(container);
      break;
    case Environment.TEST:
      await configureInfrastructureForTest(container);
      break;
    case Environment.DEVELOPMENT:
    default:
      await configureInfrastructureForDevelopment(container);
      break;
  }

  return container;
};

let globalContainerPromise: Promise<DIContainer> | null = null;

export const getContainer = async (): Promise<DIContainer> => {
  // すでに初期化済みまたは初期化中の場合は同じPromiseを返す
  if (!globalContainerPromise) {
    globalContainerPromise = createContainer();
  }

  return globalContainerPromise;
};

export const resetContainer = (): void => {
  globalContainerPromise = null;
};

export const initializeContainer = async (
  environment: Environment
): Promise<DIContainer> => {
  globalContainerPromise = createContainer(environment);
  return globalContainerPromise;
};
