import type { ExpiryStatus } from "@/domain/entities/seasoning/seasoning";

export interface GetSeasoningInput {
  readonly seasoningId: number;
}

export interface GetSeasoningOutput {
  readonly id: number;
  readonly name: string;
  readonly typeId: number;
  readonly imageId: number | null;
  readonly bestBeforeAt: string | null; // ISO string
  readonly expiresAt: string | null; // ISO string
  readonly purchasedAt: string | null; // ISO string
  readonly createdAt: string; // ISO string
  readonly updatedAt: string; // ISO string
  readonly expiryStatus: ExpiryStatus;
  readonly daysUntilExpiry: number | null;
}
