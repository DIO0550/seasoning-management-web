/**
 * @fileoverview SeasoningImageRepositoryFactory
 * 調味料画像リポジトリ生成関数
 */

import type { IDatabaseConnection } from "@/libs/database/interfaces/IDatabaseConnection";
import type { ISeasoningImageRepository } from "@/libs/database/interfaces/ISeasoningImageRepository";
import { SeasoningImageRepository } from "../SeasoningImageRepository";

/**
 * 調味料画像リポジトリを作成
 * @param connection データベース接続
 * @returns 調味料画像リポジトリインスタンス
 */
export const createSeasoningImageRepository = (
  connection: IDatabaseConnection
): ISeasoningImageRepository => {
  return new SeasoningImageRepository(connection);
};
