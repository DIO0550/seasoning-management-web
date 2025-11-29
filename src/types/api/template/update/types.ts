import { z } from "zod";
import {
  templateUpdateRequestSchema,
  templateUpdateResponseSchema,
  templateUpdateDataSchema,
} from "@/types/api/template/update/schemas";

/**
 * テンプレート更新リクエストの型
 */
export type TemplateUpdateRequest = z.infer<typeof templateUpdateRequestSchema>;

/**
 * テンプレート更新成功時のデータ型
 */
export type TemplateUpdateData = z.infer<typeof templateUpdateDataSchema>;

/**
 * テンプレート更新レスポンスの型
 */
export type TemplateUpdateResponse = z.infer<
  typeof templateUpdateResponseSchema
>;
