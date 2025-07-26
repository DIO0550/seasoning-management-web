/**
 * @fileoverview MySQL調味料テンプレートリポジトリ実装
 * ISeasoningTemplateRepositoryインターフェースのMySQL実装
 */

import type {
  ISeasoningTemplateRepository,
  SeasoningTemplateCreateInput,
  SeasoningTemplateUpdateInput,
  SeasoningTemplateSearchOptions,
  CreateSeasoningFromTemplateInput,
} from "@/libs/database/interfaces/ISeasoningTemplateRepository";
import type {
  CreateResult,
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "@/libs/database/interfaces/common/types";
import { SeasoningTemplate } from "../../entities/SeasoningTemplate";
import type { IDatabaseConnection } from "../../interfaces/IDatabaseConnection";

// 定数定義（後で使用）
// const SEASONING_TEMPLATE_PAGE_SIZE = 20;

/**
 * データベースから取得した生データの型定義
 */
interface SeasoningTemplateRow {
  readonly id: number;
  readonly name: string;
  readonly type_id: number;
  readonly image_id: number | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}

/**
 * MySQL用調味料テンプレートリポジトリ実装
 */
export class MySQLSeasoningTemplateRepository
  implements ISeasoningTemplateRepository
{
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningTemplateCreateInput): Promise<CreateResult> {
    // バリデーション
    if (!input.name || input.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    if (input.typeId <= 0) {
      throw new Error("typeId must be positive");
    }

    const trimmedName = input.name.trim();

    const sql = `
      INSERT INTO seasoning_template (
        name, type_id, image_id, created_at, updated_at
      ) VALUES (?, ?, ?, NOW(), NOW())
    `;

    const params = [trimmedName, input.typeId, input.imageId ?? null];

    try {
      const result = await this.connection.query(sql, params);

      if (!result.insertId) {
        throw new Error(
          "Failed to create seasoning template: no insert ID returned"
        );
      }

      return {
        id: result.insertId,
        createdAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to create seasoning template: ${error}`);
    }
  }

  async findById(id: number): Promise<SeasoningTemplate | null> {
    const sql = `
      SELECT id, name, type_id, image_id, created_at, updated_at
      FROM seasoning_template
      WHERE id = ?
    `;

    try {
      const result = await this.connection.query<SeasoningTemplateRow>(sql, [
        id,
      ]);

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new SeasoningTemplate({
        id: row.id,
        name: row.name,
        typeId: row.type_id,
        imageId: row.image_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error) {
      throw new Error(`Failed to find seasoning template by id: ${error}`);
    }
  }

  async findAll(
    _options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>> {
    // 実装は後で追加
    throw new Error("Method not implemented.");
  }

  async update(
    id: number,
    input: SeasoningTemplateUpdateInput
  ): Promise<UpdateResult> {
    // ID存在チェック
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error("Seasoning template not found");
    }

    // バリデーション
    if (input.name !== undefined && (!input.name || input.name.trim() === "")) {
      throw new Error("name cannot be empty");
    }

    // 更新するフィールドを動的に構築
    const updateFields: string[] = [];
    const params: unknown[] = [];

    if (input.name !== undefined) {
      updateFields.push("name = ?");
      params.push(input.name.trim());
    }

    if (input.typeId !== undefined) {
      updateFields.push("type_id = ?");
      params.push(input.typeId);
    }

    if (input.imageId !== undefined) {
      updateFields.push("image_id = ?");
      params.push(input.imageId);
    }

    // 更新するフィールドがない場合
    if (updateFields.length === 0) {
      return {
        updatedAt: new Date(),
        affectedRows: 0,
      };
    }

    updateFields.push("updated_at = NOW()");
    params.push(id);

    const sql = `
      UPDATE seasoning_template 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    try {
      const result = await this.connection.query(sql, params);

      return {
        updatedAt: new Date(),
        affectedRows: result.rowsAffected,
      };
    } catch (error) {
      throw new Error(`Failed to update seasoning template: ${error}`);
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    const sql = `
      DELETE FROM seasoning_template
      WHERE id = ?
    `;

    try {
      const result = await this.connection.query(sql, [id]);

      return {
        affectedRows: result.rowsAffected,
      };
    } catch (error) {
      throw new Error(`Failed to delete seasoning template: ${error}`);
    }
  }

  async findByName(name: string): Promise<SeasoningTemplate[]> {
    const sql = `
      SELECT id, name, type_id, image_id, created_at, updated_at
      FROM seasoning_template
      WHERE name LIKE ?
      ORDER BY name ASC
    `;

    try {
      const result = await this.connection.query<SeasoningTemplateRow>(sql, [
        `%${name}%`,
      ]);

      return result.rows.map(
        (row) =>
          new SeasoningTemplate({
            id: row.id,
            name: row.name,
            typeId: row.type_id,
            imageId: row.image_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          })
      );
    } catch (error) {
      throw new Error(`Failed to find seasoning templates by name: ${error}`);
    }
  }

  async findByTypeId(
    _typeId: number,
    _options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>> {
    // 実装は後で追加
    throw new Error("Method not implemented.");
  }

  async createSeasoningFromTemplate(
    _input: CreateSeasoningFromTemplateInput
  ): Promise<CreateResult> {
    // 実装は後で追加
    throw new Error("Method not implemented.");
  }

  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    let sql = `
      SELECT COUNT(*) as count
      FROM seasoning_template
      WHERE name = ?
    `;

    const params: unknown[] = [name];

    if (excludeId !== undefined) {
      sql += " AND id != ?";
      params.push(excludeId);
    }

    try {
      const result = await this.connection.query<{ count: number }>(
        sql,
        params
      );

      return result.rows.length > 0 && result.rows[0].count > 0;
    } catch (error) {
      throw new Error(
        `Failed to check if seasoning template exists by name: ${error}`
      );
    }
  }

  async count(): Promise<number> {
    const sql = `
      SELECT COUNT(*) as count
      FROM seasoning_template
    `;

    try {
      const result = await this.connection.query<{ count: number }>(sql);

      return result.rows.length > 0 ? result.rows[0].count : 0;
    } catch (error) {
      throw new Error(`Failed to count seasoning templates: ${error}`);
    }
  }
}
