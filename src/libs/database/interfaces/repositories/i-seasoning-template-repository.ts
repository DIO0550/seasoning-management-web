/**
 * @fileoverview 調味料テンプレートリポジトリインターフェース
 * クリーンアーキテクチャに基づき、調味料テンプレートデータの永続化操作を定義
 */

import type { SeasoningTemplate } from "../../entities/seasoning-template";
import type { IDatabaseConnection } from "../core/i-database-connection";
import type {
  PaginatedResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
  BaseSearchOptions,
} from "../common/types";

/**
 * 調味料テンプレート作成用の入力データ
 */
export interface SeasoningTemplateCreateInput {
  readonly name: string;
  readonly typeId: number;
  readonly imageId?: number | null;
}

/**
 * 調味料テンプレート更新用の入力データ
 */
export interface SeasoningTemplateUpdateInput {
  readonly name?: string;
  readonly typeId?: number;
  readonly imageId?: number | null;
}

/**
 * 調味料テンプレート検索オプション
 */
export interface SeasoningTemplateSearchOptions extends BaseSearchOptions {
  readonly search?: string;
  readonly typeId?: number;
  readonly hasImage?: boolean;
}

/**
 * テンプレートから調味料作成用の入力データ
 */
export interface CreateSeasoningFromTemplateInput {
  readonly templateId: number;
  readonly bestBeforeAt?: Date | null;
  readonly expiresAt?: Date | null;
  readonly purchasedAt?: Date | null;
}

/**
 * 調味料テンプレートリポジトリインターフェース
 * 調味料テンプレートエンティティの永続化層操作を定義
 */
export interface ISeasoningTemplateRepository {
  /**
   * データベース接続を注入するコンストラクタ
   */
  readonly connection: IDatabaseConnection;

  /**
   * 新しい調味料テンプレートを作成する
   * @param input 作成する調味料テンプレートのデータ
   * @returns 作成結果（ID と作成日時）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  create(input: SeasoningTemplateCreateInput): Promise<CreateResult>;

  /**
   * IDで調味料テンプレートを取得する
   * @param id 調味料テンプレートID
   * @returns 調味料テンプレートエンティティ（見つからない場合はnull）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findById(id: number): Promise<SeasoningTemplate | null>;

  /**
   * 調味料テンプレートの一覧を取得する
   * @param options 検索・フィルタリング・ページネーションオプション
   * @returns ページネーション対応の調味料テンプレート一覧
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findAll(
    options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>>;

  /**
   * 調味料テンプレートを更新する
   * @param id 更新する調味料テンプレートID
   * @param input 更新するデータ
   * @returns 更新結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  update(
    id: number,
    input: SeasoningTemplateUpdateInput
  ): Promise<UpdateResult>;

  /**
   * 調味料テンプレートを削除する
   * @param id 削除する調味料テンプレートID
   * @returns 削除結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  delete(id: number): Promise<DeleteResult>;

  /**
   * 名前で調味料テンプレートを検索する
   * @param name 検索する名前（部分一致）
   * @returns 一致する調味料テンプレートの配列
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findByName(name: string): Promise<SeasoningTemplate[]>;

  /**
   * 調味料種類IDで調味料テンプレートを検索する
   * @param typeId 調味料種類ID
   * @param options 検索オプション
   * @returns ページネーション対応の調味料テンプレート一覧
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findByTypeId(
    typeId: number,
    options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>>;

  /**
   * テンプレートから調味料を作成する
   * @param input テンプレートからの作成データ
   * @returns 作成された調味料のID
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  createSeasoningFromTemplate(
    input: CreateSeasoningFromTemplateInput
  ): Promise<CreateResult>;

  /**
   * 名前で調味料テンプレートの重複をチェックする
   * @param name チェックする名前
   * @param excludeId 除外するID（更新時に自分自身を除外）
   * @returns 重複している場合はtrue
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  existsByName(name: string, excludeId?: number): Promise<boolean>;

  /**
   * 調味料テンプレートの総数を取得する
   * @returns 調味料テンプレートの総数
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  count(): Promise<number>;
}
