import { z } from "zod";
import { paginatedResponseSchema } from "@/types/api/common/response";

export const seasoningTemplateListItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(256),
  typeId: z.number().int().positive(),
  imageId: z.number().int().positive().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const seasoningTemplateListResponseSchema = paginatedResponseSchema(
  seasoningTemplateListItemSchema,
);

export const seasoningTemplateListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "ページ番号は1以上である必要があります")
    .refine(Number.isFinite, "ページ番号は数値である必要があります")
    .default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1, "ページサイズは1以上である必要があります")
    .max(100, "ページサイズは100以下である必要があります")
    .refine(Number.isFinite, "ページサイズは数値である必要があります")
    .default(20),
  search: z
    .preprocess(
      (value) => (typeof value === "string" ? value.trim() : value),
      z
        .string()
        .max(50, "検索文字列は50文字以下である必要があります")
        .optional(),
    )
    .transform((value) => (value === "" ? undefined : value)),
});
