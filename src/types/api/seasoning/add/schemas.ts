import { z } from "zod";
import { successResponseSchema } from "../../common/schemas";

/**
 * 調味料追加リクエストのスキーマ
 */
export const seasoningAddRequestSchema = z.object({
  name: z
    .string()
    .min(1, "調味料名は必須です")
    .max(50, "調味料名は50文字以内で入力してください"),
  seasoningTypeId: z
    .number()
    .int()
    .min(1, "調味料タイプIDは正の整数である必要があります"),
  image: z.string().nullable(),
});

/**
 * 調味料データのスキーマ
 */
const seasoningDataSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  seasoningTypeId: z.number().int().positive(),
  seasoningTypeName: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 調味料追加レスポンスのスキーマ
 */
export const seasoningAddResponseSchema =
  successResponseSchema(seasoningDataSchema);
