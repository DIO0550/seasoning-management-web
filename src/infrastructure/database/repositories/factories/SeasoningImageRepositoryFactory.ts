/**
 * @fileoverview SeasoningImageRepositoryFactory
 * 調味料画像リポジトリ生成関数（Infrastructure層）
 */

import type { IDatabaseConnection } from "@/libs/database/interfaces";
import type { ISeasoningImageRepository } from "@/libs/database/interfaces/repositories/ISeasoningImageRepository";
import { MySQLSeasoningImageRepository } from "@/infrastructure/database/repositories/mysql";

/**
 * 調味料画像リポジトリを作成
 * @param connection データベース接続
 * @returns 調味料画像リポジトリインスタンス
 */
export const createSeasoningImageRepository = (
  connection: IDatabaseConnection
): ISeasoningImageRepository => {
  return new MySQLSeasoningImageRepository(connection);
};
