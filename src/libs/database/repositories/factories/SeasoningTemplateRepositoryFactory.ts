/**
 * @fileoverview SeasoningTemplateRepositoryFactory
 * 調味料テンプレートリポジトリ生成関数
 */

import type { IDatabaseConnection } from "@/libs/database/interfaces";
import type { ISeasoningTemplateRepository } from "@/libs/database/interfaces/ISeasoningTemplateRepository";
import { SeasoningTemplateRepository } from "../SeasoningTemplateRepository";

/**
 * 調味料テンプレートリポジトリを作成
 * @param connection データベース接続
 * @returns 調味料テンプレートリポジトリインスタンス
 */
export const createSeasoningTemplateRepository = (
  connection: IDatabaseConnection
): ISeasoningTemplateRepository => {
  return new SeasoningTemplateRepository(connection);
};
