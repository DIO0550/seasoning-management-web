/**
 * @fileoverview SeasoningTemplateRepositoryFactory
 * 調味料テンプレートリポジトリ生成関数（Infrastructure層）
 */

import type {
  IDatabaseConnection,
  ISeasoningTemplateRepository,
} from "@/infrastructure/database/interfaces";
import { MySQLSeasoningTemplateRepository } from "@/infrastructure/database/repositories/mysql";

/**
 * 調味料テンプレートリポジトリを作成
 * @param connection データベース接続
 * @returns 調味料テンプレートリポジトリインスタンス
 */
export const createSeasoningTemplateRepository = (
  connection: IDatabaseConnection
): ISeasoningTemplateRepository => {
  return new MySQLSeasoningTemplateRepository(connection);
};
