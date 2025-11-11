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
 * 期限ステータスの型定義
 */
export type ExpiryStatus = "fresh" | "expiring_soon" | "expired" | "unknown";

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

  /**
   * 期限までの日数を計算する
   * @returns 期限までの日数。期限がない場合はnull
   */
  calculateDaysUntilExpiry(): number | null {
    if (!this.expiresAt) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(this.expiresAt);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * 期限のステータスを取得する
   * @returns 期限ステータス
   */
  getExpiryStatus(): ExpiryStatus {
    const days = this.calculateDaysUntilExpiry();

    if (days === null) {
      return "unknown";
    }

    if (days < 0) {
      return "expired";
    }

    if (days <= 7) {
      return "expiring_soon";
    }

    return "fresh";
  }

  /**
   * 期限切れかどうかを判定する
   * @returns 期限切れの場合true
   */
  isExpired(): boolean {
    return this.getExpiryStatus() === "expired";
  }

  /**
   * 期限が近いかどうかを判定する
   * @returns 期限が7日以内の場合true
   */
  isExpiringSoon(): boolean {
    return this.getExpiryStatus() === "expiring_soon";
  }
}
