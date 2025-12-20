/**
 * @fileoverview MySQLSeasoningRepositoryクラス
 * MySQL固有の調味料リポジトリ実装
 *
 * このファイルはインフラストラクチャ層に配置され、
 * ドメイン層のISeasoningRepositoryインターフェースを実装します。
 */

import type {
  DeleteResult,
  IDatabaseConnection,
  ISeasoningRepository,
  PaginatedResult,
  SeasoningCreateInput,
  SeasoningSearchOptions,
  SeasoningUpdateInput,
  UpdateResult,
} from "@/infrastructure/database/interfaces";
import type { ITransaction } from "@/infrastructure/database/shared/transaction";
import { Seasoning } from "@/libs/database/entities/seasoning";

const SELECT_COLUMNS = `id, name, type_id, image_id, best_before_at, expires_at, purchased_at, created_at, updated_at`;

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

    const transaction = await this.connection.beginTransaction();

    try {
      const insertSql = `
        INSERT INTO seasoning (
          name, type_id, image_id, best_before_at, expires_at, purchased_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const insertParams = [
        input.name,
        input.typeId,
        input.imageId,
        input.bestBeforeAt,
        input.expiresAt,
        input.purchasedAt,
      ];

      const insertResult = await transaction.query(insertSql, insertParams);
      const insertId = insertResult.insertId;

      if (typeof insertId !== "number") {
        throw new Error("調味料の作成に失敗しました");
      }

      const created = await this.findByIdWithExecutor(transaction, insertId);

      await transaction.commit();
      return created;
    } catch (error) {
      try {
        await transaction.rollback();
      } catch {
        // rollbackに失敗しても元のエラーを優先
      }
      throw error;
    }
  }

  private async findByIdWithExecutor(
    executor: Pick<ITransaction, "query">,
    id: number
  ): Promise<Seasoning> {
    const sql = `SELECT ${SELECT_COLUMNS} FROM seasoning WHERE id = ?`;
    const result = await executor.query<SeasoningRow>(sql, [id]);

    if (result.rows.length === 0) {
      throw new Error("作成した調味料の取得に失敗しました");
    }

    return this.rowToEntity(result.rows[0]);
  }

  /**
   * IDで調味料を検索
   */
  async findById(id: number): Promise<Seasoning | null> {
    const sql = `SELECT ${SELECT_COLUMNS} FROM seasoning WHERE id = ?`;
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
    options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>> {
    const params: unknown[] = [];
    const whereClauses: string[] = [];

    // フィルタリング条件の構築
    if (options?.typeId) {
      whereClauses.push("type_id = ?");
      params.push(options.typeId);
    }

    if (options?.search) {
      const sanitized = escapeLikePattern(options.search);
      whereClauses.push("name LIKE ? ESCAPE '\\\\'");
      params.push(`%${sanitized}%`);
    }

    // WHERE句の組み立て
    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // ソート条件（将来的に拡張）
    const orderByClause = "ORDER BY created_at DESC";

    // 総件数を取得
    const countSql = `SELECT COUNT(*) AS cnt FROM seasoning ${whereClause}`;
    const countResult = await this.connection.query<{ cnt: number }>(
      countSql,
      params
    );
    const total = Number(countResult.rows[0]?.cnt ?? 0);

    // ページネーション設定
    const page = options?.pagination?.page ?? 1;
    const limit = options?.pagination?.limit ?? 20;
    const offset = (page - 1) * limit;

    // データ取得
    const sql = `SELECT ${SELECT_COLUMNS} FROM seasoning ${whereClause} ${orderByClause} LIMIT ? OFFSET ?`;
    const result = await this.connection.query<SeasoningRow>(sql, [
      ...params,
      limit,
      offset,
    ]);

    const seasonings = result.rows.map((row) => this.rowToEntity(row));

    // ページネーション結果
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    return {
      items: seasonings,
      total,
      page,
      limit,
      totalPages,
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
    const sql = `SELECT ${SELECT_COLUMNS} FROM seasoning WHERE name LIKE ? ESCAPE '\\' ORDER BY created_at DESC`;
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
    const sql = `SELECT ${SELECT_COLUMNS} FROM seasoning WHERE type_id = ? ORDER BY created_at DESC`;
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
    const sql = `SELECT ${SELECT_COLUMNS} FROM seasoning WHERE expires_at IS NOT NULL AND expires_at <= DATE_ADD(CURDATE(), INTERVAL ? DAY) ORDER BY expires_at ASC`;
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
   * 検索条件に一致する調味料の統計情報を取得する
   */
  async getStatistics(options?: {
    readonly search?: string;
    readonly typeId?: number;
  }): Promise<{
    total: number;
    expiringSoon: number;
    expired: number;
  }> {
    const params: unknown[] = [];
    const whereClauses: string[] = [];

    // フィルタリング条件の構築
    if (options?.typeId) {
      whereClauses.push("type_id = ?");
      params.push(options.typeId);
    }

    if (options?.search) {
      const sanitized = escapeLikePattern(options.search);
      whereClauses.push("name LIKE ? ESCAPE '\\\\'");
      params.push(`%${sanitized}%`);
    }

    // WHERE句の組み立て
    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // 統計情報を一度のクエリで取得
    // 消費期限を優先し、なければ賞味期限を使用
    // 期限間近: 1-7日以内（当日は期限切れに含める）
    // 期限切れ: 当日以前
    const sql = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE 
          WHEN best_before_at IS NOT NULL AND DATEDIFF(best_before_at, CURDATE()) BETWEEN 1 AND 7 THEN 1
          WHEN best_before_at IS NULL AND expires_at IS NOT NULL AND DATEDIFF(expires_at, CURDATE()) BETWEEN 1 AND 7 THEN 1
          ELSE 0 
        END) AS expiring_soon,
        SUM(CASE 
          WHEN best_before_at IS NOT NULL AND best_before_at <= CURDATE() THEN 1
          WHEN best_before_at IS NULL AND expires_at IS NOT NULL AND expires_at <= CURDATE() THEN 1
          ELSE 0 
        END) AS expired
      FROM seasoning ${whereClause}
    `;

    const result = await this.connection.query<{
      total: number;
      expiring_soon: number;
      expired: number;
    }>(sql, params);

    const row = result.rows[0];

    return {
      total: row ? Number(row.total) : 0,
      expiringSoon: row ? Number(row.expiring_soon) : 0,
      expired: row ? Number(row.expired) : 0,
    };
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
