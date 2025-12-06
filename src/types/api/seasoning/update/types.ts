import { z } from "zod";
import {
  seasoningUpdateRequestSchema,
  seasoningUpdateResponseSchema,
  seasoningUpdateDataSchema,
} from "@/types/api/seasoning/update/schemas";

/**
 * 調味料更新リクエストの型
 */
export type SeasoningUpdateRequest = z.infer<
  typeof seasoningUpdateRequestSchema
>;

/**
 * 調味料更新成功時のデータ型
 */
export type SeasoningUpdateData = z.infer<typeof seasoningUpdateDataSchema>;

/**
 * 調味料更新レスポンスの型
 */
export type SeasoningUpdateResponse = z.infer<
  typeof seasoningUpdateResponseSchema
>;
