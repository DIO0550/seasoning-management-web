/**
 * データベース接続をシングルトンパターンで管理
 * @description 環境に応じたデータベース接続を一元管理し、アプリケーション全体で共有する
 */

import mysql from "mysql2/promise";
import type { IDatabaseConnection } from "@/libs/database/interfaces";
import { MySQLConnection } from "@/libs/database/mysql/connection/MySQLConnection";
import { MySQL2ConnectionAdapter } from "@/libs/database/mysql/adapters/MySQL2ConnectionAdapter";
import { databaseConfig } from "@/config/database";

/**
 * データベース接続管理クラス（シングルトンパターン）
 */
export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connection: IDatabaseConnection | null = null;
  private readonly environment: string;

  /**
   * プライベートコンストラクタ
   * シングルトンパターンのため外部からのインスタンス化を防ぐ
   */
  private constructor() {
    this.environment = process.env.NODE_ENV || "development";
  }

  /**
   * インスタンスを取得する
   * @returns DatabaseConnectionManagerのシングルトンインスタンス
   */
  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  /**
   * データベース接続を取得する
   * 接続が存在しない場合は新しい接続を作成する
   * @returns データベース接続インスタンス
   * @throws {Error} 接続作成に失敗した場合
   */
  public async getConnection(): Promise<IDatabaseConnection> {
    if (!this.connection) {
      this.connection = await this.createConnection();
    }

    // 接続が有効かチェック
    if (!this.connection.isConnected()) {
      await this.connection.connect();
    }

    return this.connection;
  }

  /**
   * 環境に応じたデータベース接続を作成する
   * @returns データベース接続インスタンス
   * @throws {Error} 未対応の環境または接続作成失敗
   */
  private async createConnection(): Promise<IDatabaseConnection> {
    switch (this.environment) {
      case "development":
        return await this.createDevelopmentConnection();
      case "production":
        return await this.createProductionConnection();
      case "test":
        return await this.createTestConnection();
      default:
        throw new Error(`Unsupported environment: ${this.environment}`);
    }
  }

  /**
   * 開発環境用のデータベース接続を作成
   * @returns データベース接続インスタンス
   */
  private async createDevelopmentConnection(): Promise<IDatabaseConnection> {
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
  }

  /**
   * 本番環境用のデータベース接続を作成
   * @returns データベース接続インスタンス
   */
  private async createProductionConnection(): Promise<IDatabaseConnection> {
    // 本番環境でも同じ実装を使用
    return this.createDevelopmentConnection();
  }

  /**
   * テスト環境用のデータベース接続を作成
   * @returns データベース接続インスタンス
   */
  private async createTestConnection(): Promise<IDatabaseConnection> {
    // テスト環境でも同じ実装を使用
    return this.createDevelopmentConnection();
  }

  /**
   * データベース接続を閉じる
   * アプリケーション終了時やテスト終了時に使用
   * @throws {Error} 接続切断に失敗した場合
   */
  public async closeConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.disconnect();
        this.connection = null;
      } catch (error) {
        throw new Error(
          `Failed to close database connection: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }

  /**
   * 接続状態を確認する
   * @returns 接続されている場合true、そうでなければfalse
   */
  public isConnected(): boolean {
    return this.connection !== null && this.connection.isConnected();
  }

  /**
   * 現在の環境を取得する
   * @returns 現在の環境名
   */
  public getEnvironment(): string {
    return this.environment;
  }

  /**
   * テスト用：インスタンスをリセットする
   * 主にテスト環境でシングルトンの状態をクリアするために使用
   * @internal
   */
  public static resetInstanceForTesting(): void {
    if (process.env.NODE_ENV === "test") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      DatabaseConnectionManager.instance = null as any;
    }
  }
}
