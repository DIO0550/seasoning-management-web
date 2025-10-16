/**
 * @fileoverview SeasoningRepositoryFactory
 * 調味料リポジトリ生成関数（Infrastructure層）
 */

import type { IDatabaseConnection } from "@/libs/database/interfaces";
import type { ISeasoningRepository } from "@/libs/database/interfaces/repositories/ISeasoningRepository";
import { MySQLSeasoningRepository } from "@/infrastructure/database/repositories/mysql";

/**
 * 調味料リポジトリを作成
 * @param connection データベース接続
 * @returns 調味料リポジトリインスタンス
 */
export const createSeasoningRepository = (
  connection: IDatabaseConnection
): ISeasoningRepository => {
  return new MySQLSeasoningRepository(connection);
};
