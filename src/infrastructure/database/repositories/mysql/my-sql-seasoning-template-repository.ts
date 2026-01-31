/**
 * @fileoverview MySQLSeasoningTemplateRepositoryクラス
 * MySQL固有の調味料テンプレートリポジトリ実装
 */

import type {
  CreateResult,
  CreateSeasoningFromTemplateInput,
  DeleteResult,
  IDatabaseConnection,
  ISeasoningTemplateRepository,
  PaginatedResult,
  SeasoningTemplateCreateInput,
  SeasoningTemplateSearchOptions,
  SeasoningTemplateUpdateInput,
  UpdateResult,
} from "@/infrastructure/database/interfaces";
import { SeasoningTemplate } from "@/libs/database/entities/seasoning-template";

/**
 * LIKE 検索用のパターンをエスケープする。
 *
 * この関数は LIKE のワイルドカード記号のみをエスケープする責務を持ち、
 * SQL インジェクション対策としては必ずプレースホルダー付きクエリと組み合わせて使用する。
 */
const escapeLikePattern = (value: string): string =>
  value.replace(/([\\%_])/g, "\\$1");

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
export class MySQLSeasoningTemplateRepository implements ISeasoningTemplateRepository {
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
    options?: SeasoningTemplateSearchOptions,
  ): Promise<PaginatedResult<SeasoningTemplate>> {
    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (options?.search) {
      const sanitized = escapeLikePattern(options.search);
      conditions.push("name LIKE ? ESCAPE '\\\\'");
      params.push(`%${sanitized}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countSql = `SELECT COUNT(*) AS cnt FROM seasoning_template${
      whereClause ? ` ${whereClause}` : ""
    }`;
    const countResult = await this.connection.query<{ cnt: number }>(
      countSql,
      params,
    );
    const total = Number(countResult.rows[0]?.cnt ?? 0);

    const page = options?.pagination?.page ?? 1;
    const limit = options?.pagination?.limit ?? 20;
    const offset = (page - 1) * limit;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    const sql = `SELECT * FROM seasoning_template${
      whereClause ? ` ${whereClause}` : ""
    } ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const result = await this.connection.query<SeasoningTemplateRow>(sql, [
      ...params,
      limit,
      offset,
    ]);

    const seasoningTemplates = result.rows.map((row) => this.rowToEntity(row));

    return {
      items: seasoningTemplates,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(
    _id: number,
    _input: SeasoningTemplateUpdateInput,
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
    _options?: SeasoningTemplateSearchOptions,
  ): Promise<PaginatedResult<SeasoningTemplate>> {
    throw new Error("Method not implemented.");
  }

  async createSeasoningFromTemplate(
    _input: CreateSeasoningFromTemplateInput,
  ): Promise<CreateResult> {
    throw new Error("Method not implemented.");
  }

  async existsByName(_name: string, _excludeId?: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async countByTypeId(typeId: number): Promise<number> {
    const sql =
      "SELECT COUNT(*) AS cnt FROM seasoning_template WHERE type_id = ?";
    const result = await this.connection.query<{ cnt: number }>(sql, [typeId]);
    const row = result.rows[0];
    return row ? Number(row.cnt) : 0;
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
