/**
 * @fileoverview MySQLSeasoningRepositoryクラス
 * MySQL固有の調味料リポジトリ実装
 *
 * このファイルはインフラストラクチャ層に配置され、
 * ドメイン層のISeasoningRepositoryインターフェースを実装します。
 */

import type {
  ISeasoningRepository,
  SeasoningCreateInput,
  SeasoningUpdateInput,
  SeasoningSearchOptions,
} from "@/libs/database/interfaces/repositories/ISeasoningRepository";
import type {
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "@/libs/database/interfaces/common/types";
import { Seasoning } from "@/libs/database/entities/Seasoning";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core";

/**
 * LIKE 検索用のパターンをエスケープする
 */
const escapeLikePattern = (value: string): string =>
  value.replace(/([\\%_])/g, "\\$1");

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
 * MySQL用調味料リポジトリ実装
 *
 * @remarks
 * このクラスはMySQL固有のSQL文とデータ変換ロジックを含みます。
 * ドメイン層のインターフェースを実装することで、依存性逆転の原則に従います。
 */
export class MySQLSeasoningRepository implements ISeasoningRepository {
  /**
   * コンストラクタでDB接続を注入
   * @param connection データベース接続
   */
  constructor(public readonly connection: IDatabaseConnection) {}

  /**
   * 新しい調味料を作成
   */
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

  /**
   * IDで調味料を検索
   */
  async findById(id: number): Promise<Seasoning | null> {
    const sql = "SELECT * FROM seasoning WHERE id = ?";
    const result = await this.connection.query<SeasoningRow>(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToEntity(result.rows[0]);
  }

  /**
   * すべての調味料を取得
   */
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

  /**
   * 調味料を更新
   */
  async update(
    _id: number,
    _input: SeasoningUpdateInput
  ): Promise<UpdateResult> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  /**
   * 調味料を削除
   */
  async delete(_id: number): Promise<DeleteResult> {
    // 最小限の実装
    throw new Error("Method not implemented.");
  }

  /**
   * 名前で調味料を検索
   */
  async findByName(name: string): Promise<Seasoning[]> {
    const sanitized = escapeLikePattern(name);
    const like = `%${sanitized}%`;
    const sql =
      "SELECT * FROM seasoning WHERE name LIKE ? ESCAPE '\\' ORDER BY created_at DESC";
    const result = await this.connection.query<SeasoningRow>(sql, [like]);
    return result.rows.map((row) => this.rowToEntity(row));
  }

  /**
   * タイプIDで調味料を検索
   */
  async findByTypeId(
    typeId: number,
    _options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>> {
    const sql =
      "SELECT * FROM seasoning WHERE type_id = ? ORDER BY created_at DESC";
    const result = await this.connection.query<SeasoningRow>(sql, [typeId]);
    const items = result.rows.map((row) => this.rowToEntity(row));
    return {
      items,
      total: items.length,
      page: 1,
      limit: items.length,
      totalPages: 1,
    };
  }

  /**
   * 期限切れ間近の調味料を検索
   */
  async findExpiringSoon(days: number): Promise<Seasoning[]> {
    const sql =
      "SELECT * FROM seasoning WHERE expires_at IS NOT NULL AND expires_at <= DATE_ADD(CURDATE(), INTERVAL ? DAY) ORDER BY expires_at ASC";
    const result = await this.connection.query<SeasoningRow>(sql, [days]);
    return result.rows.map((row) => this.rowToEntity(row));
  }

  /**
   * 調味料の総数を取得
   */
  async count(): Promise<number> {
    const sql = "SELECT COUNT(*) AS cnt FROM seasoning";
    const result = await this.connection.query<{ cnt: number }>(sql);
    const row = result.rows[0];
    return row ? Number(row.cnt) : 0;
  }

  /**
   * データベース行をSeasoningエンティティに変換
   * @param row データベース行
   * @returns Seasoningエンティティ
   * @private
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
