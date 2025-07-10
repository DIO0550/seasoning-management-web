import { z } from "zod";
import { paginationSchema } from "./schemas";

/**
 * 成功レスポンスの型
 */
export type SuccessResponse<T> = {
  result_code: "OK";
  data: T;
};

/**
 * エラーレスポンスの型
 */
export type ErrorResponse<TErrorCode extends string> = {
  result_code: TErrorCode;
};

/**
 * API レスポンスのユニオン型
 * 成功時は data あり、エラー時は result_code のみ
 */
export type ApiResponse<TData, TErrorCode extends string = string> =
  | SuccessResponse<TData>
  | ErrorResponse<TErrorCode>;

/**
 * ページネーション情報の型
 */
export type Pagination = z.infer<typeof paginationSchema>;

/**
 * ページ付きレスポンスの型
 */
export type PaginatedResponse<
  T,
  TErrorCode extends string = string
> = ApiResponse<
  {
    items: T[];
    pagination: Pagination;
  },
  TErrorCode
>;
