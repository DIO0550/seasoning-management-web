/**
 * データベース接続ファクトリー
 * @description 環境に応じたデータベース接続を生成する
 */

import mysql from "mysql2/promise";
import type { IDatabaseConnection } from "@/libs/database/interfaces/IDatabaseConnection";
import { MySQLConnection } from "@/libs/database/mysql/connection/MySQLConnection";
import { MySQL2ConnectionAdapter } from "@/libs/database/mysql/adapters/MySQL2ConnectionAdapter";
import { databaseConfig } from "@/config/database";

/**
 * 開発環境用のデータベース接続を作成
 * @returns データベース接続インスタンス
 */
export const createDevelopmentConnection =
  async (): Promise<IDatabaseConnection> => {
    const config = databaseConfig;

    // MySQL2のコネクションプールを作成
    const pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: config.connectionLimit,
      timezone: config.timezone,
      charset: config.charset,
    });

    // プールから接続を取得
    const connection = await pool.getConnection();

    // アダプターでラップ
    const adapter = new MySQL2ConnectionAdapter(connection);

    // MySQLConnectionインスタンスを作成
    const dbConnection = new MySQLConnection(adapter);

    // 接続を確立
    await dbConnection.connect();

    return dbConnection;
  };

/**
 * 本番環境用のデータベース接続を作成
 * @returns データベース接続インスタンス
 */
export const createProductionConnection =
  async (): Promise<IDatabaseConnection> => {
    // 本番環境でも同じ実装を使用
    return createDevelopmentConnection();
  };

/**
 * テスト環境用のデータベース接続を作成
 * @returns データベース接続インスタンス
 */
export const createTestConnection = async (): Promise<IDatabaseConnection> => {
  // テスト環境でも同じ実装を使用
  return createDevelopmentConnection();
};
