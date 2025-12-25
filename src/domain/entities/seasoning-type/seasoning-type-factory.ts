import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";
import { ValidationError } from "@/domain/errors";

export const SeasoningTypeFactory = {
  create: (name: string): string => {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
      throw new ValidationError("name", "調味料の種類名は必須です");
    }

    if (trimmed.length > SEASONING_TYPE_NAME_MAX_LENGTH) {
      throw new ValidationError(
        "name",
        `調味料の種類名は${SEASONING_TYPE_NAME_MAX_LENGTH}文字以内で入力してください`
      );
    }

    return trimmed;
  },
} as const;
