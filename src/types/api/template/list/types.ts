import { z } from "zod";
import {
  TemplateListQuerySchema,
  TemplateListResponseSchema,
  TemplateListDataSchema,
} from "@/types/api/template/list/schemas";

/**
 * テンプレート一覧クエリパラメータの型
 */
export type TemplateListQuery = z.infer<typeof TemplateListQuerySchema>;

/**
 * テンプレート一覧成功時のデータ型
 */
export type TemplateListData = z.infer<typeof TemplateListDataSchema>;

/**
 * テンプレート一覧レスポンスの型
 */
export type TemplateListResponse = z.infer<typeof TemplateListResponseSchema>;
