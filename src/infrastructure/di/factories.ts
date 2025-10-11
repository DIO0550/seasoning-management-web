/**
 * Infrastructure層のファクトリー関数
 * @description データベース接続とリポジトリインスタンスを生成
 */

import { ConnectionManager } from "@/infrastructure/database/ConnectionManager";
import type { IDatabaseConnectionProvider } from "@/libs/database/interfaces/core";
import type { ConnectionConfig } from "@/libs/database/interfaces/core";
import { databaseConfig, type DatabaseConfig } from "@/config/database";

/**
 * DatabaseConfigをConnectionConfigに変換する
 */
const toConnectionConfig = (config: DatabaseConfig): ConnectionConfig => ({
  host: config.host,
  port: config.port,
  database: config.database,
  username: config.username,
  password: config.password,
  maxConnections: config.connectionLimit,
  minConnections: 2, // デフォルト値
  connectTimeout: config.acquireTimeout,
  queryTimeout: config.timeout,
});

/**
 * 開発環境用のデータベース接続プロバイダーを作成
 * @returns データベース接続プロバイダー
 */
export const createDevelopmentConnectionProvider =
  async (): Promise<IDatabaseConnectionProvider> => {
    const config = toConnectionConfig(databaseConfig);
    const manager = ConnectionManager.getInstance();
    await manager.initialize(config);
    return manager;
  };

/**
 * 本番環境用のデータベース接続プロバイダーを作成
 * @returns データベース接続プロバイダー
 */
export const createProductionConnectionProvider =
  async (): Promise<IDatabaseConnectionProvider> => {
    const config = toConnectionConfig(databaseConfig);
    const manager = ConnectionManager.getInstance();
    await manager.initialize(config);
    return manager;
  };

/**
 * テスト環境用のデータベース接続プロバイダーを作成
 * @returns データベース接続プロバイダー
 */
export const createTestConnectionProvider =
  async (): Promise<IDatabaseConnectionProvider> => {
    const config = toConnectionConfig(databaseConfig);
    const manager = ConnectionManager.getInstance();
    await manager.initialize(config);
    return manager;
  };

/**
 * カスタム設定でデータベース接続プロバイダーを作成
 * @param config データベース接続設定
 * @returns データベース接続プロバイダー
 */
export const createCustomConnectionProvider = async (
  config: ConnectionConfig
): Promise<IDatabaseConnectionProvider> => {
  const manager = ConnectionManager.getInstance();
  await manager.initialize(config);
  return manager;
};
