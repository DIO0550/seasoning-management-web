/**
 * @fileoverview 調味料画像エンティティ
 * データベースのseasoning_imageテーブルに対応するドメインエンティティ
 */

import { z } from "zod";

/**
 * UUID の正規表現パターン
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 調味料画像エンティティのZodスキーマ
 */
export const SeasoningImageSchema = z.object({
  id: z.number().positive(),
  folderUuid: z.string().regex(UUID_REGEX, "Invalid UUID format"),
  filename: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 調味料画像エンティティの型定義
 */
export interface SeasoningImageData {
  readonly id: number;
  readonly folderUuid: string;
  readonly filename: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * 調味料画像エンティティクラス
 * DBスキーマ: seasoning_image テーブルに対応
 */
export class SeasoningImage {
  public readonly id: number;
  public readonly folderUuid: string;
  public readonly filename: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: SeasoningImageData) {
    // バリデーション
    if (!data.folderUuid || !UUID_REGEX.test(data.folderUuid)) {
      throw new Error("folderUuid must be a valid UUID");
    }
    if (!data.filename || data.filename.trim() === "") {
      throw new Error("filename cannot be empty");
    }

    this.id = data.id;
    this.folderUuid = data.folderUuid;
    this.filename = data.filename;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
