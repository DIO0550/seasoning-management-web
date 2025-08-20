/**
 * @fileoverview SeasoningRepositoryクラス
 * コンストラクタ注入パターンで動作する調味料リポジトリ
 */

import type {
  ISeasoningRepository,
  SeasoningCreateInput,
  SeasoningUpdateInput,
  SeasoningSearchOptions,
} from "@/libs/database/interfaces/ISeasoningRepository";
import type {
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "@/libs/database/interfaces/common/types";
import { Seasoning } from "@/libs/database/entities/Seasoning";
import type { IDatabaseConnection } from "@/libs/database/interfaces";

/**
 * データベースから取得した生データの型定義
 */
interface SeasoningRow {
  readonly id: number;
  readonly name: string;
  readonly type_id: number;
  readonly image_id: number | null;
  readonly best_before_at: Date | null;
  readonly expires_at: Date | null;
  readonly purchased_at: Date | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}

/**
 * 調味料リポジトリ（コンストラクタ注入パターン）
 */
export class SeasoningRepository implements ISeasoningRepository {
  /**
   * コンストラクタでDB接続を注入
   * @param connection データベース接続
   */
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningCreateInput): Promise<Seasoning> {
    if (!input.name?.trim()) {
      throw new Error("調味料名は必須です");
    }

    const sql = `
      INSERT INTO seasoning (
        name, type_id, image_id, best_before_at, expires_at, purchased_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      input.name,
      input.typeId,
      input.imageId,
      input.bestBeforeAt,
      input.expiresAt,
      input.purchasedAt,
    ];

    const result = await this.connection.query(sql, params);
    const insertId = result.insertId!;

    // 作成したレコードを取得して返す
    const created = await this.findById(insertId);
    if (!created) {
      throw new Error("作成した調味料の取得に失敗しました");
    }

    return created;
  }

  async findById(id: number): Promise<Seasoning | null> {
    const sql = "SELECT * FROM seasoning WHERE id = ?";
    const result = await this.connection.query<SeasoningRow>(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToEntity(result.rows[0]);
  }

  async findAll(
    _options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>> {
    const sql = "SELECT * FROM seasoning ORDER BY created_at DESC";
    const result = await this.connection.query<SeasoningRow>(sql);

    const seasonings = result.rows.map((row) => this.rowToEntity(row));

    return {
      items: seasonings,
      total: seasonings.length,
      page: 1,
      limit: seasonings.length,
      totalPages: 1,
    };
  }

  async update(
    _id: number,
    _input: SeasoningUpdateInput
  ): Promise<UpdateResult> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async delete(_id: number): Promise<DeleteResult> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async findByName(_name: string): Promise<Seasoning[]> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async findByTypeId(
    _typeId: number,
    _options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async findExpiringSoon(_days: number): Promise<Seasoning[]> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  async count(): Promise<number> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  /**
   * データベース行をSeasoningエンティティに変換
   * @param row データベース行
   * @returns Seasoningエンティティ
   */
  private rowToEntity(row: SeasoningRow): Seasoning {
    return new Seasoning({
      id: row.id,
      name: row.name,
      typeId: row.type_id,
      imageId: row.image_id,
      bestBeforeAt: row.best_before_at,
      expiresAt: row.expires_at,
      purchasedAt: row.purchased_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
