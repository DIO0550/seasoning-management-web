import { z } from "zod";

/**
 * エラーレスポンスの詳細情報を表すスキーマ
 */
export const errorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});

export type ErrorDetail = z.infer<typeof errorDetailSchema>;

/**
 * 統一エラーレスポンスのスキーマ
 */
export const errorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(errorDetailSchema).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
