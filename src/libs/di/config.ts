/**
 * 環境別設定管理
 * @description 環境に応じたDIコンテナの設定を管理
 */

import { DIContainer } from "./container";
import {
  configureForDevelopment,
  configureForProduction,
  configureForTest,
} from "./bindings";

/**
 * 環境種別
 */
export const Environment = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type Environment = (typeof Environment)[keyof typeof Environment];

/**
 * 現在の環境を取得する
 * @returns 現在の環境
 */
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

/**
 * 環境に応じたDIコンテナを作成する
 * @param environment 環境（省略時は自動判定）
 * @returns 設定済みDIコンテナ
 */
export const createContainer = (environment?: Environment): DIContainer => {
  const env = environment || getCurrentEnvironment();
  const container = new DIContainer();

  switch (env) {
    case Environment.PRODUCTION:
      configureForProduction(container);
      break;
    case Environment.TEST:
      configureForTest(container);
      break;
    case Environment.DEVELOPMENT:
    default:
      configureForDevelopment(container);
      break;
  }

  return container;
};

/**
 * グローバルDIコンテナインスタンス
 * アプリケーション全体で共有される
 */
let globalContainer: DIContainer | null = null;

/**
 * グローバルDIコンテナを取得する
 * 初回呼び出し時に作成される
 * @returns グローバルDIコンテナ
 */
export const getContainer = (): DIContainer => {
  if (!globalContainer) {
    globalContainer = createContainer();
  }

  return globalContainer;
};

/**
 * グローバルDIコンテナをリセットする
 * 主にテスト用途で使用
 */
export const resetContainer = (): void => {
  if (globalContainer) {
    globalContainer.clear();
  }
  globalContainer = null;
};

/**
 * 特定の環境でグローバルコンテナを初期化する
 * @param environment 環境
 */
export const initializeContainer = (environment: Environment): void => {
  resetContainer();
  globalContainer = createContainer(environment);
};
