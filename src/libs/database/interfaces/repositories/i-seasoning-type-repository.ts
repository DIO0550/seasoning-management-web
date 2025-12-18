/**
 * @fileoverview 調味料種類リポジトリインターフェース
 * クリーンアーキテクチャに基づき、調味料種類データの永続化操作を定義
 */

import type { SeasoningType } from "../../entities/seasoning-type";
import type { IDatabaseConnection } from "../core/i-database-connection";
import type {
  PaginatedResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
  BaseSearchOptions,
} from "../common/types";

/**
 * 調味料種類作成用の入力データ
 */
export interface SeasoningTypeCreateInput {
  readonly name: string;
}

/**
 * 調味料種類更新用の入力データ
 */
export interface SeasoningTypeUpdateInput {
  readonly name?: string;
}

/**
 * 調味料種類検索オプション
 */
export interface SeasoningTypeSearchOptions extends BaseSearchOptions {
  readonly search?: string;
}

/**
 * 調味料種類リポジトリインターフェース
 * 調味料種類エンティティの永続化層操作を定義
 */
export interface ISeasoningTypeRepository {
  /**
   * データベース接続を注入するコンストラクタ
   */
  readonly connection: IDatabaseConnection;

  /**
   * 新しい調味料種類を作成する
   * @param input 作成する調味料種類のデータ
   * @returns 作成結果（ID と作成日時）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  create(input: SeasoningTypeCreateInput): Promise<CreateResult>;

  /**
   * IDで調味料種類を取得する
   * @param id 調味料種類ID
   * @returns 調味料種類エンティティ（見つからない場合はnull）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findById(id: number): Promise<SeasoningType | null>;

  /**
   * 調味料種類の一覧を取得する
   * @param options 検索・フィルタリング・ページネーションオプション
   * @returns ページネーション対応の調味料種類一覧
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findAll(
    options?: SeasoningTypeSearchOptions
  ): Promise<PaginatedResult<SeasoningType>>;

  /**
   * 調味料種類を更新する
   * @param id 更新する調味料種類ID
   * @param input 更新するデータ
   * @returns 更新結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  update(id: number, input: SeasoningTypeUpdateInput): Promise<UpdateResult>;

  /**
   * 調味料種類を削除する
   * @param id 削除する調味料種類ID
   * @returns 削除結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  delete(id: number): Promise<DeleteResult>;

  /**
   * 名前で調味料種類を検索する
   * @param name 検索する名前（部分一致）
   * @returns 一致する調味料種類の配列
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findByName(name: string): Promise<SeasoningType[]>;

  /**
   * 名前で調味料種類の重複をチェックする
   * @param name チェックする名前
   * @param excludeId 除外するID（更新時に自分自身を除外）
   * @returns 重複している場合はtrue
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  existsByName(name: string, excludeId?: number): Promise<boolean>;

  /**
   * 調味料種類の総数を取得する
   * @returns 調味料種類の総数
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  count(): Promise<number>;
}
