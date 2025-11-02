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
let isInitializing = false;

export const getContainer = async (): Promise<DIContainer> => {
  // すでに初期化済みの場合はそのまま返す
  if (globalContainerPromise) {
    return globalContainerPromise;
  }

  // 初期化中の場合は完了を待つ
  if (isInitializing) {
    // 短い間隔でポーリングして初期化完了を待つ
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    // 初期化完了後にPromiseが設定されているはず
    if (globalContainerPromise) {
      return globalContainerPromise;
    }
  }

  // 初期化開始
  isInitializing = true;
  try {
    globalContainerPromise = createContainer();
    await globalContainerPromise; // 初期化完了を待つ
    return globalContainerPromise;
  } finally {
    isInitializing = false;
  }
};

export const resetContainer = (): void => {
  globalContainerPromise = null;
  isInitializing = false;
};

export const initializeContainer = async (
  environment: Environment
): Promise<DIContainer> => {
  globalContainerPromise = createContainer(environment);
  return globalContainerPromise;
};
