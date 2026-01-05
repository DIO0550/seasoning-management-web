/**
 * @fileoverview 調味料更新UseCase DTO定義
 */

import type { ExpiryStatus } from "@/domain/entities/seasoning/seasoning";

/**
 * 調味料更新Input DTO
 * すべてのフィールドは任意（部分更新対応）
 */
export interface UpdateSeasoningInput {
  readonly seasoningId: number;
  readonly name?: string;
  readonly typeId?: number;
  readonly imageId?: number | null;
  readonly bestBeforeAt?: string | null;
  readonly expiresAt?: string | null;
  readonly purchasedAt?: string | null;
}

/**
 * 調味料更新Output DTO
 */
export interface UpdateSeasoningOutput {
  readonly id: number;
  readonly name: string;
  readonly typeId: number;
  readonly imageId: number | null;
  readonly bestBeforeAt: string | null;
  readonly expiresAt: string | null;
  readonly purchasedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly expiryStatus: ExpiryStatus;
  readonly daysUntilExpiry: number | null;
}
