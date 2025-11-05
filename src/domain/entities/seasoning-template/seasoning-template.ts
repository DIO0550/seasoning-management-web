/**
 * @fileoverview 調味料テンプレートエンティティ
 * データベースのseasoning_templateテーブルに対応するドメインエンティティ
 */

import { z } from "zod";

/**
 * 調味料テンプレートエンティティのZodスキーマ
 */
export const SeasoningTemplateSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  typeId: z.number().positive(),
  imageId: z.number().positive().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 調味料テンプレートエンティティの型定義
 */
export interface SeasoningTemplateData {
  readonly id: number;
  readonly name: string;
  readonly typeId: number;
  readonly imageId: number | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * 調味料テンプレートエンティティクラス
 * DBスキーマ: seasoning_template テーブルに対応
 */
export class SeasoningTemplate {
  public readonly id: number;
  public readonly name: string;
  public readonly typeId: number;
  public readonly imageId: number | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: SeasoningTemplateData) {
    // バリデーション
    if (!data.name || data.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    this.id = data.id;
    this.name = data.name;
    this.typeId = data.typeId;
    this.imageId = data.imageId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
