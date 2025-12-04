import { z } from "zod";
import {
  templateListQuerySchema,
  templateListResponseSchema,
  templateListDataSchema,
} from "@/types/api/template/list/schemas";

/**
 * テンプレート一覧クエリパラメータの型
 */
export type TemplateListQuery = z.infer<typeof templateListQuerySchema>;

/**
 * テンプレート一覧成功時のデータ型
 */
export type TemplateListData = z.infer<typeof templateListDataSchema>;

/**
 * テンプレート一覧レスポンスの型
 */
export type TemplateListResponse = z.infer<typeof templateListResponseSchema>;
