import { z } from "zod";
import {
  seasoningAddRequestSchema,
  seasoningAddResponseSchema,
} from "@/types/api/seasoning/add/schemas";
import type { ApiResponse } from "@/types/api/common/types";
import type { SeasoningAddErrorCode } from "@/types/api/seasoning/add/errorCode";

/**
 * 調味料追加リクエストの型
 */
export type SeasoningAddRequest = z.infer<typeof seasoningAddRequestSchema>;

/**
 * 調味料追加成功時のデータ型
 */
export type SeasoningAddData = z.infer<typeof seasoningAddResponseSchema>;

/**
 * 調味料追加レスポンスの型（ユニオン型）
 */
export type SeasoningAddResponse = ApiResponse<
  SeasoningAddData,
  SeasoningAddErrorCode
>;
