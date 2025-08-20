/**
 * @fileoverview SeasoningImageRepositoryクラス
 * コンストラクタ注入パターンで動作する調味料画像リポジトリ
 */

import type {
  ISeasoningImageRepository,
  SeasoningImageCreateInput,
  SeasoningImageUpdateInput,
  SeasoningImageSearchOptions,
  ImagePathResult,
} from "@/libs/database/interfaces/ISeasoningImageRepository";
import type {
  CreateResult,
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "@/libs/database/interfaces/common/types";
import { SeasoningImage } from "@/libs/database/entities/SeasoningImage";
import type { IDatabaseConnection } from "@/libs/database/interfaces";

/**
 * データベースから取得した生データの型定義
 */
interface SeasoningImageRow {
  readonly id: number;
  readonly folder_uuid: string;
  readonly filename: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

/**
 * 調味料画像リポジトリ（コンストラクタ注入パターン）
 */
export class SeasoningImageRepository implements ISeasoningImageRepository {
  /**
   * コンストラクタでDB接続を注入
   * @param connection データベース接続
   */
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningImageCreateInput): Promise<CreateResult> {
    // バリデーション
    if (!input.filename || input.filename.trim() === "") {
      throw new Error("filename cannot be empty");
    }

    const sql = `
      INSERT INTO seasoning_image (
        folder_uuid, filename, created_at, updated_at
      ) VALUES (?, ?, NOW(), NOW())
    `;

    const params = [input.folderUuid, input.filename];

    const result = await this.connection.query(sql, params);

    return {
      id: result.insertId!,
      createdAt: new Date(),
    };
  }

  async findById(id: number): Promise<SeasoningImage | null> {
    const sql = "SELECT * FROM seasoning_image WHERE id = ?";
    const result = await this.connection.query<SeasoningImageRow>(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToEntity(result.rows[0]);
  }

  async findAll(
    _options?: SeasoningImageSearchOptions
  ): Promise<PaginatedResult<SeasoningImage>> {
    const sql = "SELECT * FROM seasoning_image ORDER BY created_at DESC";
    const result = await this.connection.query<SeasoningImageRow>(sql);

    const seasoningImages = result.rows.map((row) => this.rowToEntity(row));

    return {
      items: seasoningImages,
      total: seasoningImages.length,
      page: 1,
      limit: seasoningImages.length,
      totalPages: 1,
    };
  }

  async update(
    _id: number,
    _input: SeasoningImageUpdateInput
  ): Promise<UpdateResult> {
    throw new Error("Method not implemented.");
  }

  async delete(_id: number): Promise<DeleteResult> {
    throw new Error("Method not implemented.");
  }

  async findByFilename(_filename: string): Promise<SeasoningImage | null> {
    throw new Error("Method not implemented.");
  }

  async findByMimeType(_mimeType: string): Promise<SeasoningImage[]> {
    throw new Error("Method not implemented.");
  }

  async findByFolderUuid(_folderUuid: string): Promise<SeasoningImage | null> {
    throw new Error("Method not implemented.");
  }

  generateUuid(): string {
    throw new Error("Method not implemented.");
  }

  generateImagePath(_folderUuid: string, _filename: string): ImagePathResult {
    throw new Error("Method not implemented.");
  }

  async existsByFolderUuid(
    _folderUuid: string,
    _excludeId?: number
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async count(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  /**
   * データベース行をSeasoningImageエンティティに変換
   * @param row データベース行
   * @returns SeasoningImageエンティティ
   */
  private rowToEntity(row: SeasoningImageRow): SeasoningImage {
    return new SeasoningImage({
      id: row.id,
      folderUuid: row.folder_uuid,
      filename: row.filename,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
