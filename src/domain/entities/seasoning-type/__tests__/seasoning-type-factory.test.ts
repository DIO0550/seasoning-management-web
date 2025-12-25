import { test, expect } from "vitest";
import { SeasoningTypeFactory } from "@/domain/entities/seasoning-type/seasoning-type-factory";
import { ValidationError } from "@/domain/errors";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";

test("SeasoningTypeFactory.create: 前後の空白を除去した名前を返す", () => {
  const result = SeasoningTypeFactory.create("  液体調味料  ");

  expect(result).toBe("液体調味料");
});

test("SeasoningTypeFactory.create: 空文字の場合はValidationErrorを投げる", () => {
  expect(() => SeasoningTypeFactory.create("   ")).toThrow(ValidationError);
});

test("SeasoningTypeFactory.create: 最大文字数を超える場合はValidationErrorを投げる", () => {
  const tooLong = "あ".repeat(SEASONING_TYPE_NAME_MAX_LENGTH + 1);

  expect(() => SeasoningTypeFactory.create(tooLong)).toThrow(ValidationError);
});
