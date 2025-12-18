/**
 * @fileoverview 調味料画像リポジトリインターフェース
 * クリーンアーキテクチャに基づき、調味料画像データの永続化操作を定義
 */

import type { SeasoningImage } from "../../entities/seasoning-image";
import type { IDatabaseConnection } from "../core/i-database-connection";
import type {
  PaginatedResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
  BaseSearchOptions,
} from "../common/types";

/**
 * 調味料画像作成用の入力データ
 */
export interface SeasoningImageCreateInput {
  readonly folderUuid: string;
  readonly filename: string;
}

/**
 * 調味料画像更新用の入力データ
 */
export interface SeasoningImageUpdateInput {
  readonly folderUuid?: string;
  readonly filename?: string;
}

/**
 * 調味料画像検索オプション
 */
export interface SeasoningImageSearchOptions extends BaseSearchOptions {
  readonly folderUuid?: string;
  readonly filename?: string;
}

/**
 * ファイルパス生成結果
 */
export interface ImagePathResult {
  readonly fullPath: string;
  readonly webPath: string;
  readonly absolutePath: string;
}

/**
 * 調味料画像リポジトリインターフェース
 * 調味料画像エンティティの永続化層操作を定義
 */
export interface ISeasoningImageRepository {
  /**
   * データベース接続を注入するコンストラクタ
   */
  readonly connection: IDatabaseConnection;

  /**
   * 新しい調味料画像メタデータを作成する
   * @param input 作成する調味料画像のデータ
   * @returns 作成結果（ID と作成日時）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  create(input: SeasoningImageCreateInput): Promise<CreateResult>;

  /**
   * IDで調味料画像を取得する
   * @param id 調味料画像ID
   * @returns 調味料画像エンティティ（見つからない場合はnull）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findById(id: number): Promise<SeasoningImage | null>;

  /**
   * 調味料画像の一覧を取得する
   * @param options 検索・フィルタリング・ページネーションオプション
   * @returns ページネーション対応の調味料画像一覧
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findAll(
    options?: SeasoningImageSearchOptions
  ): Promise<PaginatedResult<SeasoningImage>>;

  /**
   * 調味料画像を更新する
   * @param id 更新する調味料画像ID
   * @param input 更新するデータ
   * @returns 更新結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  update(id: number, input: SeasoningImageUpdateInput): Promise<UpdateResult>;

  /**
   * 調味料画像を削除する
   * @param id 削除する調味料画像ID
   * @returns 削除結果
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  delete(id: number): Promise<DeleteResult>;

  /**
   * フォルダUUIDで調味料画像を検索する
   * @param folderUuid フォルダUUID
   * @returns 一致する調味料画像（見つからない場合はnull）
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  findByFolderUuid(folderUuid: string): Promise<SeasoningImage | null>;

  /**
   * 新しいフォルダUUIDを生成する
   * @returns 一意のUUID文字列
   */
  generateUuid(): string;

  /**
   * フォルダUUIDとファイル名からファイルパスを生成する
   * @param folderUuid フォルダUUID
   * @param filename ファイル名
   * @returns ファイルパス情報
   */
  generateImagePath(folderUuid: string, filename: string): ImagePathResult;

  /**
   * フォルダUUIDの重複をチェックする
   * @param folderUuid チェックするフォルダUUID
   * @param excludeId 除外するID（更新時に自分自身を除外）
   * @returns 重複している場合はtrue
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  existsByFolderUuid(folderUuid: string, excludeId?: number): Promise<boolean>;

  /**
   * 調味料画像の総数を取得する
   * @returns 調味料画像の総数
   * @throws {RepositoryError} データベース操作でエラーが発生した場合
   */
  count(): Promise<number>;
}
