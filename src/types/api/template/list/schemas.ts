import { z } from "zod";
import { paginatedResponseSchema } from "@/types/api/common/response";

/**
 * テンプレート一覧クエリパラメータのスキーマ
 */
export const templateListQuerySchema = z.object({
  page: z
    .number()
    .int()
    .min(1, "ページ番号は1以上である必要があります")
    .default(1),
  pageSize: z
    .number()
    .int()
    .min(1, "ページサイズは1以上である必要があります")
    .max(100, "ページサイズは100以下である必要があります")
    .default(20),
  search: z.string().nullable().default(null),
});

/**
 * テンプレートに含まれる調味料のスキーマ（一覧表示用）
 */
const templateListSeasoningSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  seasoningTypeId: z.number().int().positive(),
  seasoningTypeName: z.string(),
  imageUrl: z.string().nullable(),
});

/**
 * テンプレートアイテムのスキーマ
 */
const templateItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  seasoningCount: z.number().int().min(0),
  seasonings: z.array(templateListSeasoningSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * テンプレート一覧レスポンスのスキーマ
 */
export const templateListResponseSchema =
  paginatedResponseSchema(templateItemSchema);
