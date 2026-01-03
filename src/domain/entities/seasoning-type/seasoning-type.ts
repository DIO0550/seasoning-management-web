/**
 * @fileoverview 調味料種類エンティティ
 * データベースのseasoning_typeテーブルに対応するドメインエンティティ
 */

import { z } from "zod";

/**
 * 調味料種類エンティティのZodスキーマ
 */
export const SeasoningTypeSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 調味料種類エンティティの型定義
 */
export interface SeasoningTypeData {
  readonly id: number;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * 調味料種類エンティティクラス
 * DBスキーマ: seasoning_type テーブルに対応
 */
export class SeasoningType {
  public readonly id: number;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: SeasoningTypeData) {
    if (!data.name || data.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
