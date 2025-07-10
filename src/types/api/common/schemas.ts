import { z } from "zod";

/**
 * 成功レスポンスのスキーマを生成する関数
 */
export const successResponseSchema = <T extends z.ZodType>(dataSchema: T) => {
  return z.object({
    result_code: z.literal("OK"),
    data: dataSchema,
  });
};

/**
 * エラーレスポンスのスキーマを生成する関数
 */
export const errorResponseSchema = <TErrorCode extends string>(
  errorCodes: readonly TErrorCode[]
) => {
  return z.object({
    result_code: z.enum(errorCodes as [TErrorCode, ...TErrorCode[]]),
  });
};

/**
 * API レスポンスのユニオンスキーマを生成する関数
 */
export const apiResponseSchema = <
  T extends z.ZodType,
  TErrorCode extends string
>(
  dataSchema: T,
  errorCodes: readonly TErrorCode[]
) => {
  return z.union([
    successResponseSchema(dataSchema),
    errorResponseSchema(errorCodes),
  ]);
};

/**
 * ページネーション情報のスキーマ
 */
export const paginationSchema = z.object({
  page: z.number().min(1, "ページ番号は1以上である必要があります"),
  limit: z.number().min(1, "リミットは1以上である必要があります"),
  total: z.number().min(0, "総数は0以上である必要があります"),
  totalPages: z.number().min(0, "総ページ数は0以上である必要があります"),
});
