import { z } from "zod";
import {
  templateUpdateRequestSchema,
  templateUpdateResponseSchema,
} from "@/types/api/template/update/schemas";
import type { ApiResponse } from "@/types/api/common/types";
import type { TemplateUpdateErrorCode } from "@/types/api/template/update/errorCode";

/**
 * テンプレート更新リクエストの型
 */
export type TemplateUpdateRequest = z.infer<typeof templateUpdateRequestSchema>;

/**
 * テンプレート更新成功時のデータ型
 */
export type TemplateUpdateData = z.infer<typeof templateUpdateResponseSchema>;

/**
 * テンプレート更新レスポンスの型（ユニオン型）
 */
export type TemplateUpdateResponse = ApiResponse<
  TemplateUpdateData,
  TemplateUpdateErrorCode
>;
