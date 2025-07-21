/**
 * @fileoverview MySQL調味料画像リポジトリ実装
 * ISeasoningImageRepositoryインターフェースのMySQL実装
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
import type { IDatabaseConnection } from "@/libs/database/interfaces/IDatabaseConnection";

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
 * MySQL調味料画像リポジトリ実装
 */
export class MySQLSeasoningImageRepository
  implements ISeasoningImageRepository
{
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningImageCreateInput): Promise<CreateResult> {
    const query = `
      INSERT INTO seasoning_image (folder_uuid, filename)
      VALUES (?, ?)
    `;

    try {
      const result = await this.connection.query(query, [
        input.folderUuid,
        input.filename,
      ]);

      const insertId = result.insertId;
      if (!insertId) {
        throw new Error("Failed to get insert ID");
      }

      return {
        id: insertId,
        createdAt: new Date(),
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ER_DUP_ENTRY"
      ) {
        throw new Error(`Folder UUID already exists: ${input.folderUuid}`);
      }
      throw error;
    }
  }

  async findById(id: number): Promise<SeasoningImage | null> {
    if (id <= 0) {
      return null;
    }

    const query = `
      SELECT id, folder_uuid, filename, created_at, updated_at
      FROM seasoning_image
      WHERE id = ?
    `;

    const result = await this.connection.query<SeasoningImageRow>(query, [id]);

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new SeasoningImage({
      id: row.id,
      folderUuid: row.folder_uuid,
      filename: row.filename,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findAll(
    options?: SeasoningImageSearchOptions
  ): Promise<PaginatedResult<SeasoningImage>> {
    const page = options?.pagination?.page ?? 1;
    const limit = options?.pagination?.limit ?? 20;
    const offset = (page - 1) * limit;

    let whereClause = "";
    const params: unknown[] = [];

    if (options?.folderUuid) {
      whereClause = " WHERE folder_uuid = ?";
      params.push(options.folderUuid);
    }

    if (options?.filename) {
      whereClause += whereClause ? " AND" : " WHERE";
      whereClause += " filename LIKE ?";
      params.push(`%${options.filename}%`);
    }

    // 総件数を取得
    const countQuery = `SELECT COUNT(*) as count FROM seasoning_image${whereClause}`;
    const countResult = await this.connection.query<{ count: number }>(
      countQuery,
      params
    );
    const total = countResult.rows?.[0]?.count ?? 0;

    // データを取得
    const sortField = options?.sort?.field ?? "created_at";
    const sortDirection = options?.sort?.direction ?? "DESC";
    const dataQuery = `
      SELECT id, folder_uuid, filename, created_at, updated_at
      FROM seasoning_image
      ${whereClause}
      ORDER BY ${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];
    const dataResult = await this.connection.query<SeasoningImageRow>(
      dataQuery,
      dataParams
    );

    const items = (dataResult.rows ?? []).map(
      (row) =>
        new SeasoningImage({
          id: row.id,
          folderUuid: row.folder_uuid,
          filename: row.filename,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(
    id: number,
    input: SeasoningImageUpdateInput
  ): Promise<UpdateResult> {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (input.folderUuid !== undefined) {
      updates.push("folder_uuid = ?");
      params.push(input.folderUuid);
    }

    if (input.filename !== undefined) {
      updates.push("filename = ?");
      params.push(input.filename);
    }

    if (updates.length === 0) {
      return {
        affectedRows: 0,
        updatedAt: new Date(),
      };
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);

    const query = `
      UPDATE seasoning_image
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    try {
      const result = await this.connection.query(query, params);
      return {
        affectedRows: result.rowsAffected ?? 0,
        updatedAt: new Date(),
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ER_DUP_ENTRY"
      ) {
        throw new Error(`Folder UUID already exists: ${input.folderUuid}`);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    const query = `DELETE FROM seasoning_image WHERE id = ?`;

    const result = await this.connection.query(query, [id]);

    return {
      affectedRows: result.rowsAffected ?? 0,
    };
  }

  async findByFolderUuid(folderUuid: string): Promise<SeasoningImage | null> {
    const query = `
      SELECT id, folder_uuid, filename, created_at, updated_at
      FROM seasoning_image
      WHERE folder_uuid = ?
    `;

    const result = await this.connection.query<SeasoningImageRow>(query, [
      folderUuid,
    ]);

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new SeasoningImage({
      id: row.id,
      folderUuid: row.folder_uuid,
      filename: row.filename,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  generateUuid(): string {
    return crypto.randomUUID();
  }

  generateImagePath(folderUuid: string, filename: string): ImagePathResult {
    const fullPath = `uploads/images/${folderUuid}/${filename}`;
    const webPath = `/images/${folderUuid}/${filename}`;
    const absolutePath = `${process.cwd()}/public/images/${folderUuid}/${filename}`;

    return {
      fullPath,
      webPath,
      absolutePath,
    };
  }

  async existsByFolderUuid(
    folderUuid: string,
    excludeId?: number
  ): Promise<boolean> {
    let query = `
      SELECT COUNT(*) as count
      FROM seasoning_image
      WHERE folder_uuid = ?
    `;
    const params: unknown[] = [folderUuid];

    if (excludeId !== undefined) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }

    const result = await this.connection.query<{ count: number }>(
      query,
      params
    );

    if (!result.rows || result.rows.length === 0) {
      return false;
    }

    return result.rows[0].count > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM seasoning_image`;

    const result = await this.connection.query<{ count: number }>(query);

    if (!result.rows || result.rows.length === 0) {
      return 0;
    }

    return result.rows[0].count;
  }
}
