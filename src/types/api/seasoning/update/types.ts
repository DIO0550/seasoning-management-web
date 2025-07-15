import { z } from "zod";
import {
  seasoningUpdateRequestSchema,
  seasoningUpdateResponseSchema,
} from "@/types/api/seasoning/update/schemas";
import type { ApiResponse } from "@/types/api/common/types";
import type { SeasoningUpdateErrorCode } from "@/types/api/seasoning/update/errorCode";

/**
 * 調味料更新リクエストの型
 */
export type SeasoningUpdateRequest = z.infer<
  typeof seasoningUpdateRequestSchema
>;

/**
 * 調味料更新成功時のデータ型
 */
export type SeasoningUpdateData = z.infer<typeof seasoningUpdateResponseSchema>;

/**
 * 調味料更新レスポンスの型（ユニオン型）
 */
export type SeasoningUpdateResponse = ApiResponse<
  SeasoningUpdateData,
  SeasoningUpdateErrorCode
>;
