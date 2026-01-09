/**
 * @fileoverview 調味料複製UseCase DTO定義
 */

import type { ExpiryStatus } from "@/domain/entities/seasoning/seasoning";

/**
 * 調味料複製Input DTO
 * すべてのフィールドは任意（指定がない場合は元の値をコピー）
 */
export interface DuplicateSeasoningInput {
  readonly seasoningId: number;
  readonly name?: string;
  readonly imageId?: number | null;
  readonly bestBeforeAt?: string | null;
  readonly expiresAt?: string | null;
  readonly purchasedAt?: string | null;
}

/**
 * 調味料複製Output DTO
 */
export interface DuplicateSeasoningOutput {
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
