import { z } from "zod";
import { errorResponseSchema, paginationSchema } from "./schemas";

/**
 * エラーレスポンスの型
 */
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * 成功レスポンスの型を生成するヘルパー
 */
export type SuccessResponse<T> = {
  success: true;
  data: T;
};

/**
 * ページネーション情報の型
 */
export type Pagination = z.infer<typeof paginationSchema>;

/**
 * ページ付きレスポンスの型
 */
export type PaginatedResponse<T> = SuccessResponse<{
  items: T[];
  pagination: Pagination;
}>;
