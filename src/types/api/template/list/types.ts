import { z } from "zod";
import { templateListQuerySchema, templateListResponseSchema } from "./schemas";

/**
 * テンプレート一覧クエリパラメータの型
 */
export type TemplateListQuery = z.infer<typeof templateListQuerySchema>;

/**
 * テンプレート一覧レスポンスの型
 */
export type TemplateListResponse = z.infer<typeof templateListResponseSchema>;
