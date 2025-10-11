/**
 * リポジトリファクトリー
 * @description データベース接続プロバイダーからリポジトリインスタンスを生成
 */

import type { IDatabaseConnectionProvider } from "@/libs/database/interfaces/core";
import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
  ISeasoningTemplateRepository,
} from "@/libs/database/interfaces";
import {
  MySQLSeasoningRepository,
  MySQLSeasoningTypeRepository,
  MySQLSeasoningImageRepository,
  MySQLSeasoningTemplateRepository,
} from "@/infrastructure/database/repositories/mysql";

/**
 * リポジトリファクトリー
 * データベース接続プロバイダーを使用してリポジトリを生成する
 */
export class RepositoryFactory {
  constructor(
    private readonly connectionProvider: IDatabaseConnectionProvider
  ) {}

  /**
   * 調味料リポジトリを作成
   */
  async createSeasoningRepository(): Promise<ISeasoningRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningRepository(connection);
  }

  /**
   * 調味料種類リポジトリを作成
   */
  async createSeasoningTypeRepository(): Promise<ISeasoningTypeRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningTypeRepository(connection);
  }

  /**
   * 調味料画像リポジトリを作成
   */
  async createSeasoningImageRepository(): Promise<ISeasoningImageRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningImageRepository(connection);
  }

  /**
   * 調味料テンプレートリポジトリを作成
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
