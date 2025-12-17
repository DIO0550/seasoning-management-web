/**
 * @fileoverview SeasoningRepositoryFactory
 * 調味料リポジトリ生成関数（Infrastructure層）
 */

import type {
  IDatabaseConnection,
  ISeasoningRepository,
} from "@/infrastructure/database/interfaces";
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
