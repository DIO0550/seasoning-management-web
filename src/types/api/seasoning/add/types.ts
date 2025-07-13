import { z } from "zod";
import {
  seasoningAddRequestSchema,
  seasoningAddResponseSchema,
} from "@/types/api/seasoning/add/schemas";
import type { ApiResponse } from "@/types/api/common/types";

/**
 * 調味料追加リクエストの型
 */
export type SeasoningAddRequest = z.infer<typeof seasoningAddRequestSchema>;

/**
 * 調味料追加APIのエラーコード
 */
export type SeasoningAddErrorCode =
  | "VALIDATION_ERROR_NAME_REQUIRED"
  | "VALIDATION_ERROR_NAME_TOO_LONG"
  | "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  | "VALIDATION_ERROR_TYPE_REQUIRED"
  | "VALIDATION_ERROR_IMAGE_INVALID_TYPE"
  | "VALIDATION_ERROR_IMAGE_TOO_LARGE"
  | "DUPLICATE_NAME"
  | "INTERNAL_ERROR";

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
