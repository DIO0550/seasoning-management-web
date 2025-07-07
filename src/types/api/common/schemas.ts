import { z } from "zod";

/**
 * エラーレスポンスのスキーマ
 */
export const errorResponseSchema = z.object({
  error: z.literal(true),
  message: z.string().min(1, "エラーメッセージは必須です"),
  code: z.string(),
  details: z.record(z.string()).optional(),
});

/**
 * 成功レスポンスのスキーマを生成する関数
 */
export const successResponseSchema = <T extends z.ZodType>(dataSchema: T) => {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  });
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
