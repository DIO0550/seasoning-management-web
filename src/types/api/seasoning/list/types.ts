/**
 * @fileoverview 調味料API型定義
 * OpenAPI仕様に基づいたリクエスト/レスポンス型定義
 */

import { z } from "zod";
import { paginatedResponseSchema } from "@/types/api/common/response";

/**
 * 調味料一覧アイテム
 */
export const seasoningListItemSchema = z.object({
  id: z.number().int().min(1),
  name: z.string().max(100),
  typeId: z.number().int().min(1),
  imageId: z.number().int().min(1).nullable(),
  bestBeforeAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  purchasedAt: z.string().nullable(),
  daysUntilExpiry: z.number().int().nullable(),
  expiryStatus: z.enum(["fresh", "expiring_soon", "expired", "unknown"]),
});

export type SeasoningListItem = z.infer<typeof seasoningListItemSchema>;

/**
 * 調味料一覧サマリー
 */
export const seasoningListSummarySchema = z.object({
  totalCount: z.number().int().min(0),
  expiringCount: z.number().int().min(0),
  expiredCount: z.number().int().min(0),
});

export type SeasoningListSummary = z.infer<typeof seasoningListSummarySchema>;

/**
 * 調味料一覧レスポンス
 */
export const seasoningListResponseSchema = paginatedResponseSchema(
  seasoningListItemSchema,
  { summarySchema: seasoningListSummarySchema }
);

export type SeasoningListResponse = z.infer<typeof seasoningListResponseSchema>;

/**
 * ソートキーの型定義
 */
export const seasoningListSortKeySchema = z.enum([
  "expiryAsc",
  "expiryDesc",
  "nameAsc",
  "nameDesc",
]);

export type SortKey = z.infer<typeof seasoningListSortKeySchema>;

/**
 * 調味料一覧取得クエリパラメータ
 */
export const seasoningListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  typeId: z.coerce.number().int().min(1).optional(),
  expiresWithinDays: z.coerce.number().int().min(0).optional(),
  search: z.string().max(100).optional(),
  sort: seasoningListSortKeySchema.default("expiryAsc"),
});

export type SeasoningListQuery = z.infer<typeof seasoningListQuerySchema>;

/**
 * エラーレスポンス
 * 共通定義を再エクスポート
 */
export {
  errorDetailSchema as ErrorDetailSchema,
  type ErrorDetail,
  errorResponseSchema as ErrorResponseSchema,
  type ErrorResponse,
} from "@/types/api/common/error";
