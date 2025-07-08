/**
 * 環境変数管理
 * アプリケーション設定を一元管理する
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_HOST",
  "DATABASE_PORT",
  "DATABASE_USER",
  "DATABASE_PASSWORD",
  "DATABASE_NAME",
] as const;

/**
 * 環境変数の型定義
 */
interface EnvironmentVariables {
  readonly DATABASE_HOST: string;
  readonly DATABASE_PORT: number;
  readonly DATABASE_USER: string;
  readonly DATABASE_PASSWORD: string;
  readonly DATABASE_NAME: string;
  readonly NODE_ENV: "development" | "production" | "test";
}

/**
 * 必須環境変数の存在チェック
 */
const validateRequiredVars = (): void => {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

/**
 * DATABASE_PORTの数値変換と検証
 */
const validateDatabasePort = (): number => {
  const databasePort = parseInt(process.env.DATABASE_PORT!, 10);
  if (isNaN(databasePort)) {
    throw new Error("DATABASE_PORT must be a valid number");
  }
  return databasePort;
};

/**
 * NODE_ENVの検証と取得
 */
const validateNodeEnv = (): EnvironmentVariables["NODE_ENV"] => {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv && !["development", "production", "test"].includes(nodeEnv)) {
    throw new Error("NODE_ENV must be development, production, or test");
  }
  return (nodeEnv as EnvironmentVariables["NODE_ENV"]) || "development";
};

/**
 * 検証済み環境変数の取得
 */
const getEnvironmentVariables = (): EnvironmentVariables => {
  validateRequiredVars();

  return {
    DATABASE_HOST: process.env.DATABASE_HOST!,
    DATABASE_PORT: validateDatabasePort(),
    DATABASE_USER: process.env.DATABASE_USER!,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD!,
    DATABASE_NAME: process.env.DATABASE_NAME!,
    NODE_ENV: validateNodeEnv(),
  };
};

/**
 * 検証済み環境変数のエクスポート
 */
export const env = getEnvironmentVariables();

/**
 * 型定義のエクスポート
 */
export type { EnvironmentVariables };
