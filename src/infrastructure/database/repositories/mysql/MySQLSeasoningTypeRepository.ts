/**
 * @fileoverview MySQLSeasoningTypeRepositoryクラス
 * MySQL固有の調味料種類リポジトリ実装
 */

import type {
  ISeasoningTypeRepository,
  SeasoningTypeCreateInput,
  SeasoningTypeUpdateInput,
  SeasoningTypeSearchOptions,
} from "@/libs/database/interfaces/repositories/ISeasoningTypeRepository";
import type {
  CreateResult,
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "@/libs/database/interfaces/common/types";
import { SeasoningType } from "@/libs/database/entities/SeasoningType";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core";

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
  /**
   * コンストラクタでDB接続を注入
   * @param connection データベース接続
   */
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningTypeCreateInput): Promise<CreateResult> {
    // バリデーション
    if (!input.name || input.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    const sql = `
      INSERT INTO seasoning_type (
        name, created_at, updated_at
      ) VALUES (?, NOW(), NOW())
    `;

    const params = [input.name];

    const result = await this.connection.query(sql, params);

    return {
      id: result.insertId!,
      createdAt: new Date(),
    };
  }

  async findById(id: number): Promise<SeasoningType | null> {
    const sql = "SELECT * FROM seasoning_type WHERE id = ?";
    const result = await this.connection.query<SeasoningTypeRow>(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToEntity(result.rows[0]);
  }

  async findAll(
    _options?: SeasoningTypeSearchOptions
  ): Promise<PaginatedResult<SeasoningType>> {
    const sql = "SELECT * FROM seasoning_type ORDER BY created_at DESC";
    const result = await this.connection.query<SeasoningTypeRow>(sql);

    const seasoningTypes = result.rows.map((row) => this.rowToEntity(row));

    return {
      items: seasoningTypes,
      total: seasoningTypes.length,
      page: 1,
      limit: seasoningTypes.length,
      totalPages: 1,
    };
  }

  async update(
    _id: number,
    _input: SeasoningTypeUpdateInput
  ): Promise<UpdateResult> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async delete(_id: number): Promise<DeleteResult> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async findByName(_name: string): Promise<SeasoningType[]> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async existsByName(_name: string, _excludeId?: number): Promise<boolean> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async count(): Promise<number> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  /**
   * データベース行をSeasoningTypeエンティティに変換
   * @param row データベース行
   * @returns SeasoningTypeエンティティ
   * @private
   */
  private rowToEntity(row: SeasoningTypeRow): SeasoningType {
    return new SeasoningType({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
