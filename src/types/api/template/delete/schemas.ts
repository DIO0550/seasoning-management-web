import { z } from "zod";
import { successResponseSchema } from "@/types/api/common/schemas";

/**
 * テンプレート削除リクエストのスキーマ
 */
export const templateDeleteRequestSchema = z.object({
  id: z
    .number({ message: "IDは必須です" })
    .int()
    .positive("IDは正の整数である必要があります"),
});

/**
 * テンプレート削除成功時のデータスキーマ
 */
const templateDeleteDataSchema = z.object({
  id: z.number().int().positive(),
  deletedAt: z.string().datetime(),
});

/**
 * テンプレート削除レスポンスのスキーマ
 */
export const templateDeleteResponseSchema = successResponseSchema(
  templateDeleteDataSchema
);
