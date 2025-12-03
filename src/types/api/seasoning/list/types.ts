/**
 * @fileoverview 調味料API型定義
 * OpenAPI仕様に基づいたリクエスト/レスポンス型定義
 */

import { z } from "zod";
import { paginationSchema } from "@/types/api/common/pagination";

/**
 * 調味料一覧アイテム
 */
export const SeasoningListItemSchema = z.object({
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

export type SeasoningListItem = z.infer<typeof SeasoningListItemSchema>;

/**
 * 調味料一覧サマリー
 */
export const SeasoningListSummarySchema = z.object({
  totalCount: z.number().int().min(0),
  expiringCount: z.number().int().min(0),
  expiredCount: z.number().int().min(0),
});

export type SeasoningListSummary = z.infer<typeof SeasoningListSummarySchema>;

/**
 * 調味料一覧レスポンス
 */
export const SeasoningListResponseSchema = z.object({
  data: z.array(SeasoningListItemSchema),
  meta: paginationSchema,
  summary: SeasoningListSummarySchema,
});

export type SeasoningListResponse = z.infer<typeof SeasoningListResponseSchema>;

/**
 * ソートキーの型定義
 */
export const SortKeySchema = z.enum([
  "expiryAsc",
  "expiryDesc",
  "nameAsc",
  "nameDesc",
]);

export type SortKey = z.infer<typeof SortKeySchema>;

/**
 * 調味料一覧取得クエリパラメータ
 */
export const SeasoningListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  typeId: z.coerce.number().int().min(1).optional(),
  expiresWithinDays: z.coerce.number().int().min(0).optional(),
  search: z.string().max(100).optional(),
  sort: SortKeySchema.default("expiryAsc"),
});

export type SeasoningListQuery = z.infer<typeof SeasoningListQuerySchema>;

/**
 * エラーレスポンスの詳細
 */
export const ErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});

export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;

/**
 * エラーレスポンス
 */
export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(ErrorDetailSchema).optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
