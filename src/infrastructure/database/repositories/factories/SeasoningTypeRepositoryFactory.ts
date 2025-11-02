/**
 * @fileoverview SeasoningTypeRepositoryFactory
 * 調味料種類リポジトリ生成関数（Infrastructure層）
 */

import type {
  IDatabaseConnection,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import { MySQLSeasoningTypeRepository } from "@/infrastructure/database/repositories/mysql";

/**
 * 調味料種類リポジトリを作成
 * @param connection データベース接続
 * @returns 調味料種類リポジトリインスタンス
 */
export const createSeasoningTypeRepository = (
  connection: IDatabaseConnection
): ISeasoningTypeRepository => {
  return new MySQLSeasoningTypeRepository(connection);
};
