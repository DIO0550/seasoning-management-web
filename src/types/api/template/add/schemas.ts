import { z } from "zod";
import { successResponseSchema } from "@/types/api/common/response";

/**
 * テンプレート追加リクエストのスキーマ
 */
export const templateAddRequestSchema = z.object({
  name: z
    .string()
    .min(1, "テンプレート名は必須です")
    .max(100, "テンプレート名は100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .nullable(),
  imageId: z
    .number({ message: "画像IDは数値である必要があります" })
    .int("画像IDは整数である必要があります")
    .min(1, "画像IDは1以上である必要があります")
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
  imageId: z.number().int().positive().nullable(),
  imageUrl: z.string().nullable(),
});

/**
 * テンプレートデータのスキーマ
 */
export const templateAddDataSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  imageId: z.number().int().positive().nullable(),
  imageUrl: z.string().nullable(),
  seasonings: z.array(templateSeasoningSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * テンプレート追加レスポンスのスキーマ
 */
export const templateAddResponseSchema = successResponseSchema(
  templateAddDataSchema
);
