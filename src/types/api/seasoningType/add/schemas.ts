import { z } from "zod";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";
import { normalizeSeasoningTypeName } from "@/domain/entities/seasoning-type/seasoning-type-name-normalizer";

/**
 * 調味料種類追加リクエストのスキーマ
 */
export const seasoningTypeAddRequestSchema = z.object({
  name: z.preprocess(
    normalizeSeasoningTypeName,
    z
      .string()
      .min(1, "調味料の種類名は必須です")
      .max(
        SEASONING_TYPE_NAME_MAX_LENGTH,
        `調味料の種類名は${SEASONING_TYPE_NAME_MAX_LENGTH}文字以内で入力してください`,
      ),
  ),
});

/**
 * 調味料種類データのスキーマ
 */
export const seasoningTypeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 調味料種類追加レスポンスのスキーマ
 */
export const seasoningTypeAddResponseSchema = z.object({
  data: seasoningTypeSchema,
});
