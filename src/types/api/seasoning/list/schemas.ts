import { z } from "zod";
import { successResponseSchema, paginationSchema } from "../../common/schemas";

/**
 * 調味料一覧クエリパラメータのスキーマ
 */
export const seasoningListQuerySchema = z.object({
  page: z.number().int().min(1, "ページ番号は1以上である必要があります"),
  limit: z
    .number()
    .int()
    .min(1, "リミットは1以上である必要があります")
    .max(100, "リミットは100以下である必要があります"),
  seasoningTypeId: z.number().int().positive().nullable(),
  search: z.string().nullable(),
});

/**
 * 調味料アイテムのスキーマ
 */
const seasoningItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  seasoningTypeId: z.number().int().positive(),
  seasoningTypeName: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 調味料一覧データのスキーマ
 */
const seasoningListDataSchema = z.object({
  items: z.array(seasoningItemSchema),
  pagination: paginationSchema,
});

/**
 * 調味料一覧レスポンスのスキーマ
 */
export const seasoningListResponseSchema = successResponseSchema(
  seasoningListDataSchema
);
