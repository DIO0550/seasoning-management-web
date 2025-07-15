import { z } from "zod";
import {
  templateDeleteRequestSchema,
  templateDeleteResponseSchema,
} from "@/types/api/template/delete/schemas";
import type { ApiResponse } from "@/types/api/common/types";
import type { TemplateDeleteErrorCode } from "@/types/api/template/delete/errorCode";

/**
 * テンプレート削除リクエストの型
 */
export type TemplateDeleteRequest = z.infer<typeof templateDeleteRequestSchema>;

/**
 * テンプレート削除成功時のデータ型
 */
export type TemplateDeleteData = z.infer<typeof templateDeleteResponseSchema>;

/**
 * テンプレート削除レスポンスの型（ユニオン型）
 */
export type TemplateDeleteResponse = ApiResponse<
  TemplateDeleteData,
  TemplateDeleteErrorCode
>;
