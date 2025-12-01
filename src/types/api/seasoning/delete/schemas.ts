import { z } from "zod";
import { successResponseSchema } from "@/types/api/common/response";

/**
 * 調味料削除リクエストのスキーマ
 */
export const seasoningDeleteRequestSchema = z.object({
  id: z
    .number({ message: "IDは必須です" })
    .int()
    .positive("IDは正の整数である必要があります"),
});

/**
 * 調味料削除成功時のデータスキーマ
 */
export const seasoningDeleteDataSchema = z.object({
  id: z.number().int().positive(),
  deletedAt: z.string().datetime(),
});

/**
 * 調味料削除レスポンスのスキーマ
 */
export const seasoningDeleteResponseSchema = successResponseSchema(
  seasoningDeleteDataSchema
);
