import { z } from "zod";
import {
  seasoningDeleteRequestSchema,
  seasoningDeleteResponseSchema,
} from "@/types/api/seasoning/delete/schemas";

/**
 * 調味料削除リクエストの型
 */
export type SeasoningDeleteRequest = z.infer<
  typeof seasoningDeleteRequestSchema
>;

/**
 * 調味料削除成功時のデータ型
 */
export type SeasoningDeleteData = z.infer<typeof seasoningDeleteResponseSchema>;

/**
 * 調味料削除レスポンスの型
 */
export type SeasoningDeleteResponse = z.infer<
  typeof seasoningDeleteResponseSchema
>;
