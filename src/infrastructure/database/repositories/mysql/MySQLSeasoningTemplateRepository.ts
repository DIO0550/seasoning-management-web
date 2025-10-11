/**
 * @fileoverview MySQLSeasoningTemplateRepositoryクラス
 * MySQL固有の調味料テンプレートリポジトリ実装
 */

import type {
  ISeasoningTemplateRepository,
  SeasoningTemplateCreateInput,
  SeasoningTemplateUpdateInput,
  SeasoningTemplateSearchOptions,
  CreateSeasoningFromTemplateInput,
} from "@/libs/database/interfaces/repositories/ISeasoningTemplateRepository";
import type {
  CreateResult,
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "@/libs/database/interfaces/common/types";
import { SeasoningTemplate } from "@/libs/database/entities/SeasoningTemplate";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core";

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
  /**
   * コンストラクタでDB接続を注入
   * @param connection データベース接続
   */
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningTemplateCreateInput): Promise<CreateResult> {
    // バリデーション
    if (!input.name || input.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    const sql = `
      INSERT INTO seasoning_template (
        name, type_id, image_id, created_at, updated_at
      ) VALUES (?, ?, ?, NOW(), NOW())
    `;

    const params = [input.name, input.typeId, input.imageId];

    const result = await this.connection.query(sql, params);

    return {
      id: result.insertId!,
      createdAt: new Date(),
    };
  }

  async findById(id: number): Promise<SeasoningTemplate | null> {
    const sql = "SELECT * FROM seasoning_template WHERE id = ?";
    const result = await this.connection.query<SeasoningTemplateRow>(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToEntity(result.rows[0]);
  }

  async findAll(
    _options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>> {
    const sql = "SELECT * FROM seasoning_template ORDER BY created_at DESC";
    const result = await this.connection.query<SeasoningTemplateRow>(sql);

    const seasoningTemplates = result.rows.map((row) => this.rowToEntity(row));

    return {
      items: seasoningTemplates,
      total: seasoningTemplates.length,
      page: 1,
      limit: seasoningTemplates.length,
      totalPages: 1,
    };
  }

  async update(
    _id: number,
    _input: SeasoningTemplateUpdateInput
  ): Promise<UpdateResult> {
    throw new Error("Method not implemented.");
  }

  async delete(_id: number): Promise<DeleteResult> {
    throw new Error("Method not implemented.");
  }

  async findByName(_name: string): Promise<SeasoningTemplate[]> {
    throw new Error("Method not implemented.");
  }

  async findBySeasoningId(_seasoningId: number): Promise<SeasoningTemplate[]> {
    throw new Error("Method not implemented.");
  }

  async findByTypeId(
    _typeId: number,
    _options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>> {
    throw new Error("Method not implemented.");
  }

  async createSeasoningFromTemplate(
    _input: CreateSeasoningFromTemplateInput
  ): Promise<CreateResult> {
    throw new Error("Method not implemented.");
  }

  async existsByName(_name: string, _excludeId?: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async count(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  /**
   * データベース行をSeasoningTemplateエンティティに変換
   * @param row データベース行
   * @returns SeasoningTemplateエンティティ
   * @private
   */
  private rowToEntity(row: SeasoningTemplateRow): SeasoningTemplate {
    return new SeasoningTemplate({
      id: row.id,
      name: row.name,
      typeId: row.type_id,
      imageId: row.image_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
