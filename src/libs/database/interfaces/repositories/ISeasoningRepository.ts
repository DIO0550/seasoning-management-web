/**
 * @fileoverview 調味料リポジトリインターフェース
 * クリーンアーキテクチャに基づき、調味料データの永続化操作を定義
 */

import type { Seasoning } from "../../entities/Seasoning";
import type { IDatabaseConnection } from "../core/IDatabaseConnection";
import type {
  PaginatedResult,
  UpdateResult,
  DeleteResult,
  BaseSearchOptions,
  DateRangeFilter,
} from "../common/types";

/**
 * 調味料作成用の入力データ
 */
export interface SeasoningCreateInput {
  readonly name: string;
  readonly typeId: number;
  readonly imageId?: number | null;
  readonly bestBeforeAt?: Date | null;
  readonly expiresAt?: Date | null;
  readonly purchasedAt?: Date | null;
}

/**
 * 調味料更新用の入力データ
 */
export interface SeasoningUpdateInput {
  readonly name?: string;
  readonly typeId?: number;
  readonly imageId?: number | null;
  readonly bestBeforeAt?: Date | null;
  readonly expiresAt?: Date | null;
  readonly purchasedAt?: Date | null;
}

/**
 * 調味料検索オプション
 */
export interface SeasoningSearchOptions extends BaseSearchOptions {
  readonly search?: string;
  readonly typeId?: number;
  readonly hasImage?: boolean;
  readonly expirationDateRange?: DateRangeFilter;
  readonly purchaseDateRange?: DateRangeFilter;
}

/**
 * 調味料リポジトリインターフェース
 * 調味料エンティティの永続化層操作を定義
 */
export interface ISeasoningRepository {
  /**
   * データベース接続を注入するコンストラクタ
   */
  readonly connection: IDatabaseConnection;

  /**
   * 新しい調味料を作成する
   * @param input 作成する調味料のデータ
   * @returns 作成された調味料エンティティ
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  create(input: SeasoningCreateInput): Promise<Seasoning>;

  /**
   * IDで調味料を取得する
   * @param id 調味料ID
   * @returns 調味料エンティティ（見つからない場合はnull）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findById(id: number): Promise<Seasoning | null>;

  /**
   * 調味料の一覧を取得する
   * @param options 検索・フィルタリング・ページネーションオプション
   * @returns ページネーション対応の調味料一覧
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findAll(
    options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>>;

  /**
   * 調味料を更新する
   * @param id 更新する調味料ID
   * @param input 更新するデータ
   * @returns 更新結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  update(id: number, input: SeasoningUpdateInput): Promise<UpdateResult>;

  /**
   * 調味料を削除する
   * @param id 削除する調味料ID
   * @returns 削除結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  delete(id: number): Promise<DeleteResult>;

  /**
   * 名前で調味料を検索する
   * @param name 検索する名前（部分一致）
   * @returns 一致する調味料の配列
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findByName(name: string): Promise<Seasoning[]>;

  /**
   * 調味料種類IDで調味料を検索する
   * @param typeId 調味料種類ID
   * @param options 検索オプション
   * @returns ページネーション対応の調味料一覧
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findByTypeId(
    typeId: number,
    options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>>;

  /**
   * 期限が近い調味料を取得する
   * @param days 何日以内の期限切れを取得するか
   * @returns 期限が近い調味料の配列
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findExpiringSoon(days: number): Promise<Seasoning[]>;

  /**
   * 調味料の総数を取得する
   * @returns 調味料の総数
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  count(): Promise<number>;
}
