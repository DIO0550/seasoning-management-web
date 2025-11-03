/**
 * リポジトリファクトリー
 * @description データベース接続プロバイダーからリポジトリインスタンスを生成
 */

import type {
  IDatabaseConnectionProvider,
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
  ISeasoningTemplateRepository,
} from "@/infrastructure/database/interfaces";
import {
  MySQLSeasoningRepository,
  MySQLSeasoningTypeRepository,
  MySQLSeasoningImageRepository,
  MySQLSeasoningTemplateRepository,
} from "@/infrastructure/database/repositories/mysql";

/**
 * リポジトリファクトリー
 * データベース接続プロバイダーを使用してリポジトリを生成する
 *
 * @note 接続の解放について
 * このファクトリーで取得する接続は、ConnectionManagerのプールから提供されます。
 * 接続の解放は以下の責務分担により自動的に行われます:
 * - 接続プール: プールされた接続の管理と自動解放
 * - リポジトリ: 接続を使用してクエリを実行
 * - 呼び出し側: トランザクション境界の管理
 *
 * 明示的な接続解放が必要な場合は、トランザクションを使用してください。
 */
export class RepositoryFactory {
  constructor(
    private readonly connectionProvider: IDatabaseConnectionProvider
  ) {}

  /**
   * 調味料リポジトリを作成
   * @note 接続はプールから自動管理されます
   */
  async createSeasoningRepository(): Promise<ISeasoningRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningRepository(connection);
  }

  /**
   * 調味料種類リポジトリを作成
   * @note 接続はプールから自動管理されます
   */
  async createSeasoningTypeRepository(): Promise<ISeasoningTypeRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningTypeRepository(connection);
  }

  /**
   * 調味料画像リポジトリを作成
   * @note 接続はプールから自動管理されます
   */
  async createSeasoningImageRepository(): Promise<ISeasoningImageRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningImageRepository(connection);
  }

  /**
   * 調味料テンプレートリポジトリを作成
   * @note 接続はプールから自動管理されます
   */
  async createSeasoningTemplateRepository(): Promise<ISeasoningTemplateRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningTemplateRepository(connection);
  }

  /**
   * 接続プロバイダーを取得する
   */
  getConnectionProvider(): IDatabaseConnectionProvider {
    return this.connectionProvider;
  }
}
