import { z } from "zod";

/**
 * エラーレスポンスの詳細情報を表すスキーマ
 */
export const errorDetailSchema = z.object({
  field: z.string().min(1).optional(),
  message: z.string().min(1),
  code: z.string().min(1).optional(),
});

export type ErrorDetail = z.infer<typeof errorDetailSchema>;

/**
 * 統一エラーレスポンスのスキーマ
 */
export const errorResponseSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.array(errorDetailSchema).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
