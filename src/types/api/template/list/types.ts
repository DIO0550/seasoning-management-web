import { z } from "zod";
import {
  templateListQuerySchema,
  templateListResponseSchema,
} from "@/types/api/template/list/schemas";
import type { PaginatedResponse } from "@/types/api/common/types";
import type { TemplateListErrorCode } from "@/types/api/template/list/errorCode";

/**
 * テンプレート一覧クエリパラメータの型
 */
export type TemplateListQuery = z.infer<typeof templateListQuerySchema>;

/**
 * テンプレート一覧成功時のデータ型
 */
export type TemplateListData = z.infer<typeof templateListResponseSchema>;

/**
 * テンプレート一覧レスポンスの型（ユニオン型）
 */
export type TemplateListResponse = PaginatedResponse<
  TemplateListData,
  TemplateListErrorCode
>;
