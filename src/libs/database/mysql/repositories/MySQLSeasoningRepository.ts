/**
 * @fileoverview MySQL調味料リポジトリ実装
 * ISeasoningRepositoryインターフェースのMySQL実装
 */

import type {
  ISeasoningRepository,
  SeasoningCreateInput,
  SeasoningUpdateInput,
  SeasoningSearchOptions,
} from "../../interfaces/ISeasoningRepository";
import type {
  CreateResult,
  UpdateResult,
  DeleteResult,
  PaginatedResult,
} from "../../interfaces/common/types";
import { Seasoning } from "../../entities/Seasoning";
import type { IDatabaseConnection } from "../../interfaces/IDatabaseConnection";
import {
  DEFAULT_PAGE_NUMBER,
  SEASONING_PAGE_SIZE,
  calculateOffset,
} from "@/constants/pagination";

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
 */
export class MySQLSeasoningRepository implements ISeasoningRepository {
  constructor(public readonly connection: IDatabaseConnection) {}

  async create(input: SeasoningCreateInput): Promise<CreateResult> {
    // バリデーション
    if (!input.name || input.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    if (input.typeId <= 0) {
      throw new Error("typeId must be positive");
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

    try {
      const result = await this.connection.query(sql, params);

      if (!result.insertId) {
        throw new Error("Failed to create seasoning: no insert ID returned");
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

  async findById(id: number): Promise<Seasoning | null> {
    if (id <= 0) {
      return null;
    }

    const sql = `
      SELECT 
        id, name, type_id, image_id, 
        best_before_at, expires_at, purchased_at, 
        created_at, updated_at
      FROM seasoning 
      WHERE id = ?
    `;

    const result = await this.connection.query(sql, [id]);

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as SeasoningRow;

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

  async findAll(
    options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>> {
    let sql = `
      SELECT 
        id, name, type_id, image_id, 
        best_before_at, expires_at, purchased_at, 
        created_at, updated_at
      FROM seasoning
    `;

    const conditions: string[] = [];
    const params: unknown[] = [];

    // 検索条件を構築
    if (options?.search) {
      conditions.push("name LIKE ?");
      params.push(`%${options.search}%`);
    }

    if (options?.typeId) {
      conditions.push("type_id = ?");
      params.push(options.typeId);
    }

    if (options?.hasImage !== undefined) {
      if (options.hasImage) {
        conditions.push("image_id IS NOT NULL");
      } else {
        conditions.push("image_id IS NULL");
      }
    }

    if (options?.expirationDateRange) {
      if (options.expirationDateRange.from) {
        conditions.push("expires_at >= ?");
        params.push(options.expirationDateRange.from);
      }
      if (options.expirationDateRange.to) {
        conditions.push("expires_at <= ?");
        params.push(options.expirationDateRange.to);
      }
    }

    if (options?.purchaseDateRange) {
      if (options.purchaseDateRange.from) {
        conditions.push("purchased_at >= ?");
        params.push(options.purchaseDateRange.from);
      }
      if (options.purchaseDateRange.to) {
        conditions.push("purchased_at <= ?");
        params.push(options.purchaseDateRange.to);
      }
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // 総数を取得（ORDER BY句を除く）
    let totalCountSql = `
      SELECT COUNT(*) as count
      FROM seasoning
    `;
    if (conditions.length > 0) {
      totalCountSql += ` WHERE ${conditions.join(" AND ")}`;
    }

    const totalResult = await this.connection.query(totalCountSql, params);
    const total = (totalResult.rows?.[0] as { count: number })?.count || 0;

    // ソート
    if (options?.sort) {
      sql += ` ORDER BY ${options.sort.field} ${options.sort.direction}`;
    } else {
      sql += " ORDER BY created_at DESC";
    }

    // ページネーション
    const page = options?.pagination?.page || DEFAULT_PAGE_NUMBER;
    const limit = options?.pagination?.limit || SEASONING_PAGE_SIZE;
    const offset = calculateOffset(page, limit);

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const result = await this.connection.query(sql, params);

    const items = (result.rows as SeasoningRow[]).map(
      (row) =>
        new Seasoning({
          id: row.id,
          name: row.name,
          typeId: row.type_id,
          imageId: row.image_id,
          bestBeforeAt: row.best_before_at,
          expiresAt: row.expires_at,
          purchasedAt: row.purchased_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, input: SeasoningUpdateInput): Promise<UpdateResult> {
    const updates: string[] = [];
    const params: unknown[] = [];

    // 動的にUPDATEクエリを構築
    if (input.name !== undefined) {
      updates.push("name = ?");
      params.push(input.name);
    }
    if (input.typeId !== undefined) {
      updates.push("type_id = ?");
      params.push(input.typeId);
    }
    if (input.imageId !== undefined) {
      updates.push("image_id = ?");
      params.push(input.imageId);
    }
    if (input.bestBeforeAt !== undefined) {
      updates.push("best_before_at = ?");
      params.push(input.bestBeforeAt);
    }
    if (input.expiresAt !== undefined) {
      updates.push("expires_at = ?");
      params.push(input.expiresAt);
    }
    if (input.purchasedAt !== undefined) {
      updates.push("purchased_at = ?");
      params.push(input.purchasedAt);
    }

    if (updates.length === 0) {
      // 更新フィールドがない場合は何もしない
      return {
        updatedAt: new Date(),
        affectedRows: 0,
      };
    }

    updates.push("updated_at = NOW()");
    params.push(id); // WHERE条件のIDを最後に追加

    const sql = `UPDATE seasoning SET ${updates.join(", ")} WHERE id = ?`;

    const result = await this.connection.query(sql, params);

    return {
      updatedAt: new Date(),
      affectedRows: result.rowsAffected,
    };
  }

  async delete(id: number): Promise<DeleteResult> {
    const sql = "DELETE FROM seasoning WHERE id = ?";
    const result = await this.connection.query(sql, [id]);

    return {
      affectedRows: result.rowsAffected,
    };
  }

  async findByName(name: string): Promise<Seasoning[]> {
    const sql = `
      SELECT 
        id, name, type_id, image_id, 
        best_before_at, expires_at, purchased_at, 
        created_at, updated_at
      FROM seasoning 
      WHERE name LIKE ?
      ORDER BY name
    `;

    const result = await this.connection.query(sql, [`%${name}%`]);

    return (result.rows as SeasoningRow[]).map(
      (row) =>
        new Seasoning({
          id: row.id,
          name: row.name,
          typeId: row.type_id,
          imageId: row.image_id,
          bestBeforeAt: row.best_before_at,
          expiresAt: row.expires_at,
          purchasedAt: row.purchased_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
    );
  }

  async findByTypeId(
    typeId: number,
    options?: SeasoningSearchOptions
  ): Promise<PaginatedResult<Seasoning>> {
    // typeId条件を追加したオプションを作成
    const searchOptions: SeasoningSearchOptions = {
      ...options,
      typeId,
    };

    return this.findAll(searchOptions);
  }

  async findExpiringSoon(days: number): Promise<Seasoning[]> {
    const sql = `
      SELECT 
        id, name, type_id, image_id, 
        best_before_at, expires_at, purchased_at, 
        created_at, updated_at
      FROM seasoning 
      WHERE expires_at IS NOT NULL 
        AND expires_at <= DATE_ADD(NOW(), INTERVAL ? DAY)
      ORDER BY expires_at ASC
    `;

    const result = await this.connection.query(sql, [days]);

    return (result.rows as SeasoningRow[]).map(
      (row) =>
        new Seasoning({
          id: row.id,
          name: row.name,
          typeId: row.type_id,
          imageId: row.image_id,
          bestBeforeAt: row.best_before_at,
          expiresAt: row.expires_at,
          purchasedAt: row.purchased_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
    );
  }

  async count(): Promise<number> {
    const sql = "SELECT COUNT(*) as count FROM seasoning";
    const result = await this.connection.query(sql);

    const row = result.rows[0] as { count: number };
    return row.count;
  }
}
