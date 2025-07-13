import { z } from "zod";
import { successResponseSchema, paginationSchema } from "@/types/api/common/schemas";

/**
 * テンプレート一覧クエリパラメータのスキーマ
 */
export const templateListQuerySchema = z.object({
  page: z.number().int().min(1, "ページ番号は1以上である必要があります"),
  limit: z
    .number()
    .int()
    .min(1, "リミットは1以上である必要があります")
    .max(100, "リミットは100以下である必要があります"),
  search: z.string().nullable(),
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
 * テンプレート一覧データのスキーマ
 */
const templateListDataSchema = z.object({
  items: z.array(templateItemSchema),
  pagination: paginationSchema,
});

/**
 * テンプレート一覧レスポンスのスキーマ
 */
export const templateListResponseSchema = successResponseSchema(
  templateListDataSchema
);
