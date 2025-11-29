import { z } from "zod";
import {
  templateDeleteRequestSchema,
  templateDeleteResponseSchema,
  templateDeleteDataSchema,
} from "@/types/api/template/delete/schemas";

/**
 * テンプレート削除リクエストの型
 */
export type TemplateDeleteRequest = z.infer<typeof templateDeleteRequestSchema>;

/**
 * テンプレート削除成功時のデータ型
 */
export type TemplateDeleteData = z.infer<typeof templateDeleteDataSchema>;

/**
 * テンプレート削除レスポンスの型
 */
export type TemplateDeleteResponse = z.infer<
  typeof templateDeleteResponseSchema
>;
