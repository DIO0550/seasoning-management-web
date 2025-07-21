/**
 * @fileoverview MySQL調味料種類リポジトリ実装
 * ISeasoningTypeRepositoryインターフェースのMySQL実装
 */

import type {
  ISeasoningTypeRepository,
  SeasoningTypeCreateInput,
  SeasoningTypeUpdateInput,
  SeasoningTypeSearchOptions,
} from "@/libs/database/interfaces/ISeasoningTypeRepository";
import type {
  CreateResult,
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "@/libs/database/interfaces/common/types";
import { SeasoningType } from "@/libs/database/entities/SeasoningType";
import type { IDatabaseConnection } from "@/libs/database/interfaces/IDatabaseConnection";

/**
 * データベースから取得した生データの型定義
 */
interface SeasoningTypeRow {
  readonly id: number;
  readonly name: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

/**
 * MySQL用調味料種類リポジトリ実装
 */
export class MySQLSeasoningTypeRepository implements ISeasoningTypeRepository {
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningTypeCreateInput): Promise<CreateResult> {
    // バリデーション
    if (!input.name || input.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    const trimmedName = input.name.trim();

    // 重複チェック
    const exists = await this.existsByName(trimmedName);
    if (exists) {
      throw new Error(
        `SeasoningType with name '${trimmedName}' already exists`
      );
    }

    const sql = `
      INSERT INTO seasoning_type (name, created_at, updated_at)
      VALUES (?, NOW(), NOW())
    `;

    try {
      const result = await this.connection.query(sql, [trimmedName]);

      if (!result.insertId) {
        throw new Error(
          "Failed to create seasoning type: no insert ID returned"
        );
      }

      return {
        id: result.insertId,
        createdAt: new Date(),
      };
    } catch (error) {
      // MySQLエラーを適切にハンドリング
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Database error occurred");
    }
  }

  async findById(id: number): Promise<SeasoningType | null> {
    if (id <= 0) {
      return null;
    }

    const sql = `
      SELECT id, name, created_at, updated_at
      FROM seasoning_type
      WHERE id = ?
    `;

    const result = await this.connection.query(sql, [id]);

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as SeasoningTypeRow;
    return new SeasoningType({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findAll(
    options?: SeasoningTypeSearchOptions
  ): Promise<PaginatedResult<SeasoningType>> {
    // デフォルト値の設定
    const page = options?.pagination?.page || 1;
    const limit = options?.pagination?.limit || 50;
    const offset = (page - 1) * limit;

    // WHERE句の構築
    let whereClause = "";
    const params: unknown[] = [];

    if (options?.search && options.search.trim() !== "") {
      whereClause = "WHERE name LIKE ?";
      params.push(`%${options.search.trim()}%`);
    }

    // ORDER BY句の構築
    let orderClause = "ORDER BY created_at ASC";
    if (options?.sort) {
      const field = options.sort.field === "name" ? "name" : "created_at";
      const direction = options.sort.direction === "DESC" ? "DESC" : "ASC";
      orderClause = `ORDER BY ${field} ${direction}`;
    }

    // 総数取得
    const countSql = `SELECT COUNT(*) as total FROM seasoning_type ${whereClause}`;
    const countResult = await this.connection.query(countSql, params);
    const total = (countResult.rows?.[0] as { total: number })?.total || 0;

    // データ取得
    const dataSql = `
      SELECT id, name, created_at, updated_at
      FROM seasoning_type
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    const dataResult = await this.connection.query(dataSql, [
      ...params,
      limit,
      offset,
    ]);

    const items = (dataResult.rows || []).map((row) => {
      const typedRow = row as SeasoningTypeRow;
      return new SeasoningType({
        id: typedRow.id,
        name: typedRow.name,
        createdAt: typedRow.created_at,
        updatedAt: typedRow.updated_at,
      });
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: number,
    input: SeasoningTypeUpdateInput
  ): Promise<UpdateResult> {
    if (input.name !== undefined) {
      // 名前が提供されている場合のバリデーション
      if (!input.name || input.name.trim() === "") {
        throw new Error("name cannot be empty");
      }

      const trimmedName = input.name.trim();

      // 重複チェック（自分自身は除外）
      const exists = await this.existsByName(trimmedName, id);
      if (exists) {
        throw new Error(
          `SeasoningType with name '${trimmedName}' already exists`
        );
      }
    }

    const updateFields: string[] = [];
    const params: unknown[] = [];

    if (input.name !== undefined) {
      updateFields.push("name = ?");
      params.push(input.name.trim());
    }

    if (updateFields.length === 0) {
      // 更新するフィールドがない場合
      return {
        updatedAt: new Date(),
        affectedRows: 0,
      };
    }

    updateFields.push("updated_at = NOW()");
    params.push(id);

    const sql = `
      UPDATE seasoning_type
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    try {
      const result = await this.connection.query(sql, params);
      const affectedRows = result.rowsAffected || 0;

      return {
        updatedAt: new Date(),
        affectedRows,
      };
    } catch (error) {
      // MySQLエラーを適切にハンドリング
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Database error occurred");
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    const sql = `DELETE FROM seasoning_type WHERE id = ?`;

    try {
      const result = await this.connection.query(sql, [id]);
      const affectedRows = result.rowsAffected || 0;

      return {
        affectedRows,
      };
    } catch (error) {
      // MySQLエラーを適切にハンドリング
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Database error occurred");
    }
  }

  async findByName(name: string): Promise<SeasoningType[]> {
    let sql: string;
    let params: unknown[];

    if (!name || name.trim() === "") {
      // 空文字の場合は全件取得
      sql = `
        SELECT id, name, created_at, updated_at
        FROM seasoning_type
        ORDER BY name ASC
      `;
      params = [];
    } else {
      // 部分一致検索
      sql = `
        SELECT id, name, created_at, updated_at
        FROM seasoning_type
        WHERE name LIKE ?
        ORDER BY name ASC
      `;
      params = [`%${name.trim()}%`];
    }

    const result = await this.connection.query(sql, params);

    return (result.rows || []).map((row) => {
      const typedRow = row as SeasoningTypeRow;
      return new SeasoningType({
        id: typedRow.id,
        name: typedRow.name,
        createdAt: typedRow.created_at,
        updatedAt: typedRow.updated_at,
      });
    });
  }

  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    let sql = `SELECT COUNT(*) as count FROM seasoning_type WHERE name = ?`;
    const params: unknown[] = [name];

    if (excludeId !== undefined) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }

    const result = await this.connection.query(sql, params);
    const count = (result.rows?.[0] as { count: number })?.count || 0;

    return count > 0;
  }

  async count(): Promise<number> {
    const sql = `SELECT COUNT(*) as total FROM seasoning_type`;
    const result = await this.connection.query(sql);
    return (result.rows?.[0] as { total: number })?.total || 0;
  }
}
