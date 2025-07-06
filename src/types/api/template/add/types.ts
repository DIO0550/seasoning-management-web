import { z } from "zod";
import { templateAddRequestSchema, templateAddResponseSchema } from "./schemas";

/**
 * テンプレート追加リクエストの型
 */
export type TemplateAddRequest = z.infer<typeof templateAddRequestSchema>;

/**
 * テンプレート追加レスポンスの型
 */
export type TemplateAddResponse = z.infer<typeof templateAddResponseSchema>;
