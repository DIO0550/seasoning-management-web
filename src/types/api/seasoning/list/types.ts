import { z } from "zod";
import {
  seasoningListQuerySchema,
  seasoningListResponseSchema,
} from "@/types/api/seasoning/list/schemas";
import type { PaginatedResponse } from "@/types/api/common/types";
import type { SeasoningListErrorCode } from "@/types/api/seasoning/list/errorCode";

/**
 * 調味料一覧クエリパラメータの型
 */
export type SeasoningListQuery = z.infer<typeof seasoningListQuerySchema>;

/**
 * 調味料一覧成功時のデータ型
 */
export type SeasoningListData = z.infer<typeof seasoningListResponseSchema>;

/**
 * 調味料一覧レスポンスの型（ユニオン型）
 */
export type SeasoningListResponse = PaginatedResponse<
  SeasoningListData,
  SeasoningListErrorCode
>;
