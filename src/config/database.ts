/**
 * データベース設定
 * MySQL接続設定とプール設定を管理する
 */

import { env } from "@/config/environment";
import {
  PRODUCTION_CONNECTION_LIMIT,
  DEVELOPMENT_CONNECTION_LIMIT,
  TEST_CONNECTION_LIMIT,
} from "@/constants/database/connectionLimits";
import {
  PRODUCTION_ACQUIRE_TIMEOUT,
  PRODUCTION_QUERY_TIMEOUT,
  DEVELOPMENT_ACQUIRE_TIMEOUT,
  DEVELOPMENT_QUERY_TIMEOUT,
  TEST_ACQUIRE_TIMEOUT,
  TEST_QUERY_TIMEOUT,
} from "@/constants/database/timeouts";

/**
 * データベース接続設定の型定義
 */
interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly connectionLimit: number;
  readonly acquireTimeout: number;
  readonly timeout: number;
  readonly reconnect: boolean;
  readonly charset: string;
  readonly timezone: string;
}

/**
 * 本番用データベース設定
 */
const PRODUCTION_DB_CONFIG: DatabaseConfig = {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  connectionLimit: PRODUCTION_CONNECTION_LIMIT,
  acquireTimeout: PRODUCTION_ACQUIRE_TIMEOUT,
  timeout: PRODUCTION_QUERY_TIMEOUT,
  reconnect: true,
  charset: "utf8mb4",
  timezone: "+00:00",
};

/**
 * 開発用データベース設定
 */
const DEVELOPMENT_DB_CONFIG: DatabaseConfig = {
  ...PRODUCTION_DB_CONFIG,
  connectionLimit: DEVELOPMENT_CONNECTION_LIMIT,
  acquireTimeout: DEVELOPMENT_ACQUIRE_TIMEOUT,
  timeout: DEVELOPMENT_QUERY_TIMEOUT,
};

/**
 * テスト用データベース設定
 */
const TEST_DB_CONFIG: DatabaseConfig = {
  ...DEVELOPMENT_DB_CONFIG,
  database: `${env.DATABASE_NAME}_test`,
  connectionLimit: TEST_CONNECTION_LIMIT,
  acquireTimeout: TEST_ACQUIRE_TIMEOUT,
  timeout: TEST_QUERY_TIMEOUT,
};

/**
 * 環境に応じたデータベース設定を取得
 */
const getDatabaseConfig = (): DatabaseConfig => {
  switch (env.NODE_ENV) {
    case "production":
      return PRODUCTION_DB_CONFIG;
    case "test":
      return TEST_DB_CONFIG;
    case "development":
    default:
      return DEVELOPMENT_DB_CONFIG;
  }
};

/**
 * 現在の環境のデータベース設定
 */
export const databaseConfig = getDatabaseConfig();

/**
 * 型定義のエクスポート
 */
export type { DatabaseConfig };
