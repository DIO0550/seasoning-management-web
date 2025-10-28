/**
 * @fileoverview 調味料のソート関連型定義
 */

/**
 * ソート順の型
 */
export type SortOrder = "expiryAsc" | "expiryDesc" | "nameAsc" | "nameDesc";

/**
 * ソート順の定数
 */
export const SortOrder = {
  EXPIRY_ASC: "expiryAsc" as const,
  EXPIRY_DESC: "expiryDesc" as const,
  NAME_ASC: "nameAsc" as const,
  NAME_DESC: "nameDesc" as const,
} as const;
