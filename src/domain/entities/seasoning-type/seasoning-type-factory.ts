import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";
import { ValidationError } from "@/domain/errors";
import { normalizeSeasoningTypeName } from "@/domain/entities/seasoning-type/seasoning-type-name-normalizer";

export const SeasoningTypeFactory = {
  create: (name: string): string => {
    const normalized = normalizeSeasoningTypeName(name);
    if (typeof normalized !== "string") {
      throw new ValidationError("name", "調味料種類名は必須です");
    }

    const trimmed = normalized;

    if (trimmed.length === 0) {
      throw new ValidationError("name", "調味料種類名は必須です");
    }

    if (trimmed.length > SEASONING_TYPE_NAME_MAX_LENGTH) {
      throw new ValidationError(
        "name",
        `調味料種類名は${SEASONING_TYPE_NAME_MAX_LENGTH}文字以内で入力してください`,
      );
    }

    return trimmed;
  },
} as const;
