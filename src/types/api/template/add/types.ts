import { z } from "zod";
import {
  templateAddRequestSchema,
  templateAddResponseSchema,
} from "@/types/api/template/add/schemas";
import type { ApiResponse } from "@/types/api/common/types";
import type { TemplateAddErrorCode } from "@/types/api/template/add/errorCode";

/**
 * テンプレート追加リクエストの型
 */
export type TemplateAddRequest = z.infer<typeof templateAddRequestSchema>;

/**
 * テンプレート追加成功時のデータ型
 */
export type TemplateAddData = z.infer<typeof templateAddResponseSchema>;

/**
 * テンプレート追加レスポンスの型（ユニオン型）
 */
export type TemplateAddResponse = ApiResponse<
  TemplateAddData,
  TemplateAddErrorCode
>;
