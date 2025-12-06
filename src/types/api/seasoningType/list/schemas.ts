import { z } from "zod";

/**
 * 調味料種類一覧レスポンスのスキーマ
 */
export const seasoningTypeListItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export const seasoningTypeListResponseSchema = z.object({
  data: z.array(seasoningTypeListItemSchema),
});
