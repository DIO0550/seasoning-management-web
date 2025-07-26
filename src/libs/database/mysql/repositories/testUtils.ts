/**
 * @fileoverview テスト用ユーティリティ
 * 実際のMySQLデータベースを使用したテスト環境のセットアップ
 */

import mysql from "mysql2/promise";
import type { Connection } from "mysql2/promise";
import { MySQL2ConnectionAdapter } from "../adapters/MySQL2ConnectionAdapter";
import { MySQLConnection } from "../connection/MySQLConnection";

/**
 * テスト用データベース設定
 */
const TEST_DB_CONFIG = {
  host: process.env.TEST_DB_HOST || "db", // devcontainer内ではdbサービス名を使用
  port: parseInt(process.env.TEST_DB_PORT || "3306"),
  user: process.env.TEST_DB_USER || "root",
  password: process.env.TEST_DB_PASSWORD || "rootpassword", // docker-composeで設定されたパスワード
  database: process.env.TEST_DB_NAME || "seasoning_management_test_db",
  multipleStatements: true,
};

/**
 * テスト用データベースのセットアップクラス
 */
export class TestDatabaseSetup {
  private connection: Connection | null = null;
  private dbConnection: MySQLConnection | null = null;
  private testId: string;

  constructor() {
    // 各テストファイルに一意のIDを生成
    this.testId = Math.random().toString(36).substring(2, 8);
  }

  /**
   * テストデータベースをセットアップする
   */
  async setup(): Promise<MySQLConnection> {
    // テストファイル別のデータベース名を生成
    const testDbName = `${
      process.env.TEST_DB_NAME || "seasoning_management_test_db"
    }_${this.testId}`;

    // 管理用接続（データベース作成用）
    const adminConnection = await mysql.createConnection({
      ...TEST_DB_CONFIG,
      database: undefined, // データベースを指定しない
    });

    try {
      // テストデータベースを作成（存在しない場合）
      await adminConnection.execute(
        `CREATE DATABASE IF NOT EXISTS \`${testDbName}\` 
         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
    } finally {
      await adminConnection.end();
    }

    // テストデータベースに接続
    this.connection = await mysql.createConnection({
      ...TEST_DB_CONFIG,
      database: testDbName,
    });

    // テーブルを作成
    await this.createTables();

    // MySQLConnection インスタンスを作成
    const adapter = new MySQL2ConnectionAdapter(this.connection);
    this.dbConnection = new MySQLConnection(adapter);
    await this.dbConnection.connect();

    return this.dbConnection;
  }

  /**
   * テストデータベースをクリーンアップする
   */
  async cleanup(): Promise<void> {
    const testDbName = `${
      process.env.TEST_DB_NAME || "seasoning_management_test_db"
    }_${this.testId}`;

    if (this.dbConnection) {
      await this.dbConnection.disconnect();
      this.dbConnection = null;
    }

    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }

    // テスト用データベースを削除して完全にクリーンアップ
    try {
      const adminConnection = await mysql.createConnection({
        ...TEST_DB_CONFIG,
        database: undefined,
      });

      try {
        await adminConnection.execute(
          `DROP DATABASE IF EXISTS \`${testDbName}\``
        );
      } finally {
        await adminConnection.end();
      }
    } catch (error) {
      // エラーが発生してもテストは続行
      console.warn(`Failed to drop test database ${testDbName}:`, error);
    }
  }

  /**
   * テーブルデータをクリアする
   */
  async clearTables(): Promise<void> {
    if (!this.connection) {
      throw new Error("Database connection not established");
    }

    // 外部キー制約は使わないため、単純にDELETEする
    await this.connection.execute("DELETE FROM seasoning");
    await this.connection.execute("DELETE FROM seasoning_template");
    await this.connection.execute("DELETE FROM seasoning_type");
    await this.connection.execute("DELETE FROM seasoning_image");

    // AUTO_INCREMENTをリセット
    await this.connection.execute("ALTER TABLE seasoning AUTO_INCREMENT = 1");
    await this.connection.execute(
      "ALTER TABLE seasoning_template AUTO_INCREMENT = 1"
    );
    await this.connection.execute(
      "ALTER TABLE seasoning_type AUTO_INCREMENT = 1"
    );
    await this.connection.execute(
      "ALTER TABLE seasoning_image AUTO_INCREMENT = 1"
    );
  }

  /**
   * テストデータを挿入する
   */
  async insertTestData(): Promise<void> {
    if (!this.connection) {
      throw new Error("Database connection not established");
    }

    // UUIDを動的に生成してテストファイル間の衝突を避ける
    const uuid1 = `${this.testId}-e29b-41d4-a716-446655440001`;
    const uuid2 = `${this.testId}-e29b-41d4-a716-446655440002`;

    // 調味料種類のテストデータ
    await this.connection.execute(`
      INSERT INTO seasoning_type (name, created_at, updated_at) VALUES
      ('塩', NOW(), NOW()),
      ('醤油', NOW(), NOW()),
      ('味噌', NOW(), NOW())
    `);

    // 調味料画像のテストデータ
    await this.connection.execute(
      `
      INSERT INTO seasoning_image (folder_uuid, filename, created_at, updated_at) VALUES
      (?, 'image.jpg', NOW(), NOW()),
      (?, 'image.jpg', NOW(), NOW())
    `,
      [uuid1, uuid2]
    );

    // 調味料のテストデータ
    await this.connection.execute(`
      INSERT INTO seasoning (name, type_id, image_id, best_before_at, expires_at, purchased_at, created_at, updated_at) VALUES
      ('天然塩', 1, 1, '2024-12-31', '2024-12-31', '2024-01-01', NOW(), NOW()),
      ('キッコーマン醤油', 2, 2, '2025-06-30', '2025-06-30', '2024-01-15', NOW(), NOW()),
      ('味噌（期限切れ間近）', 3, NULL, '2024-08-01', '2024-08-01', '2024-02-01', NOW(), NOW())
    `);
  }

  /**
   * テーブルを作成する
   * 外部キー制約は使わない（db.instructions.mdの指示に従う）
   */
  private async createTables(): Promise<void> {
    if (!this.connection) {
      throw new Error("Database connection not established");
    }

    // 調味料種類テーブル
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS seasoning_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 調味料画像テーブル
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS seasoning_image (
        id INT AUTO_INCREMENT PRIMARY KEY,
        folder_uuid CHAR(36) NOT NULL UNIQUE,
        filename VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 調味料テーブル（外部キー制約なし）
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS seasoning (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        type_id INT NOT NULL,
        image_id INT NULL,
        best_before_at DATE NULL,
        expires_at DATE NULL,
        purchased_at DATE NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 調味料テンプレートテーブル（外部キー制約なし）
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS seasoning_template (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        type_id INT NOT NULL,
        image_id INT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
  }

  /**
   * 直接SQLを実行する（テスト用）
   */
  async execute(sql: string, params?: unknown[]): Promise<unknown> {
    if (!this.connection) {
      throw new Error("Database connection not established");
    }

    const [result] = await this.connection.execute(sql, params);
    return result;
  }
}

/**
 * テスト用のファクトリ関数
 */
export const createTestDatabaseSetup = (): TestDatabaseSetup => {
  return new TestDatabaseSetup();
};
