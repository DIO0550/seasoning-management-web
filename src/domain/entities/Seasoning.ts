/**
 * @fileoverview 調味料エンティティ
 * データベースのseasoningテーブルに対応するドメインエンティティ
 */

import { z } from "zod";

/**
 * 調味料エンティティのZodスキーマ
 */
export const SeasoningSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  typeId: z.number().positive(),
  imageId: z.number().positive().nullable(),
  bestBeforeAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  purchasedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 調味料エンティティの型定義
 */
export interface SeasoningData {
  readonly id: number;
  readonly name: string;
  readonly typeId: number;
  readonly imageId: number | null;
  readonly bestBeforeAt: Date | null;
  readonly expiresAt: Date | null;
  readonly purchasedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * 調味料エンティティクラス
 * DBスキーマ: seasoning テーブルに対応
 */
export class Seasoning {
  public readonly id: number;
  public readonly name: string;
  public readonly typeId: number;
  public readonly imageId: number | null;
  public readonly bestBeforeAt: Date | null;
  public readonly expiresAt: Date | null;
  public readonly purchasedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: SeasoningData) {
    // バリデーション
    if (!data.name || data.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    this.id = data.id;
    this.name = data.name;
    this.typeId = data.typeId;
    this.imageId = data.imageId;
    this.bestBeforeAt = data.bestBeforeAt;
    this.expiresAt = data.expiresAt;
    this.purchasedAt = data.purchasedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
