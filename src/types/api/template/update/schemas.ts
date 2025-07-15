import { z } from "zod";
import { successResponseSchema } from "@/types/api/common/schemas";

/**
 * テンプレート更新リクエストのスキーマ
 */
export const templateUpdateRequestSchema = z.object({
  id: z
    .number({ message: "IDは必須です" })
    .int()
    .positive("IDは正の整数である必要があります"),
  name: z
    .string()
    .min(1, "テンプレート名は必須です")
    .max(100, "テンプレート名は100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .nullable()
    .optional(),
  seasoningIds: z
    .array(z.number().int().positive("調味料IDは正の整数である必要があります"))
    .min(1, "少なくとも1つの調味料を選択してください"),
});

/**
 * テンプレートに含まれる調味料のスキーマ
 */
const templateSeasoningSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  seasoningTypeId: z.number().int().positive(),
  seasoningTypeName: z.string(),
  imageUrl: z.string().nullable(),
});

/**
 * テンプレートデータのスキーマ
 */
const templateDataSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  seasonings: z.array(templateSeasoningSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * テンプレート更新レスポンスのスキーマ
 */
export const templateUpdateResponseSchema =
  successResponseSchema(templateDataSchema);
