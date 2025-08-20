/**
 * @fileoverview SeasoningTypeRepositoryFactory
 * 調味料種類リポジトリ生成関数
 */

import type { IDatabaseConnection } from "@/libs/database/interfaces";
import type { ISeasoningTypeRepository } from "@/libs/database/interfaces/ISeasoningTypeRepository";
import { SeasoningTypeRepository } from "../SeasoningTypeRepository";

/**
 * 調味料種類リポジトリを作成
 * @param connection データベース接続
 * @returns 調味料種類リポジトリインスタンス
 */
export const createSeasoningTypeRepository = (
  connection: IDatabaseConnection
): ISeasoningTypeRepository => {
  return new SeasoningTypeRepository(connection);
};
