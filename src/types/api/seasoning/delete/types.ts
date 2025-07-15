import { z } from "zod";
import {
  seasoningDeleteRequestSchema,
  seasoningDeleteResponseSchema,
} from "@/types/api/seasoning/delete/schemas";
import type { ApiResponse } from "@/types/api/common/types";
import type { SeasoningDeleteErrorCode } from "@/types/api/seasoning/delete/errorCode";

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
 * 調味料削除レスポンスの型（ユニオン型）
 */
export type SeasoningDeleteResponse = ApiResponse<
  SeasoningDeleteData,
  SeasoningDeleteErrorCode
>;
