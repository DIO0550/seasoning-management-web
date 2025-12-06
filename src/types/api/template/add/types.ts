import { z } from "zod";
import {
  templateAddRequestSchema,
  templateAddResponseSchema,
  templateAddDataSchema,
} from "@/types/api/template/add/schemas";

/**
 * テンプレート追加リクエストの型
 */
export type TemplateAddRequest = z.infer<typeof templateAddRequestSchema>;

/**
 * テンプレート追加成功時のデータ型
 */
export type TemplateAddData = z.infer<typeof templateAddDataSchema>;

/**
 * テンプレート追加レスポンスの型
 */
export type TemplateAddResponse = z.infer<typeof templateAddResponseSchema>;
