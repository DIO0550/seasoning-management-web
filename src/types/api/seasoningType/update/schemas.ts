import { z } from "zod";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";
import { normalizeSeasoningTypeName } from "@/domain/entities/seasoning-type/seasoning-type-name-normalizer";
import { seasoningTypeSchema } from "@/types/api/seasoningType/add/schemas";

export const seasoningTypeUpdateRequestSchema = z.object({
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

export const seasoningTypeUpdateResponseSchema = z.object({
  data: seasoningTypeSchema,
});
