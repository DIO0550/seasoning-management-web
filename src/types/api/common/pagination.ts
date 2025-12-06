import { z } from "zod";

/**
 * ページネーションメタデータのスキーマ
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalItems: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean().default(false),
  hasPrevious: z.boolean().default(false),
});

export type PaginationMeta = z.infer<typeof paginationSchema>;
