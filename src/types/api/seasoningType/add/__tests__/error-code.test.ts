import { expect, test } from "vitest";
import { ZodError } from "zod";
import { SeasoningTypeAddErrorCode } from "../error-code";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";

test(
  "fromValidationError: nameフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_NAME_REQUIREDを返す",
  () => {
    const zodError = new ZodError([
      {
        code: "too_small",
        minimum: 1,
        type: "string",
        inclusive: true,
        exact: false,
        message: "調味料種類名は必須です",
        path: ["name"],
      },
    ]);

    const result = SeasoningTypeAddErrorCode.fromValidationError(zodError);

    expect(result).toBe("VALIDATION_ERROR_NAME_REQUIRED");
  }
);

test(
  "fromValidationError: nameフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_NAME_TOO_LONGを返す",
  () => {
    const zodError = new ZodError([
      {
        code: "too_big",
        maximum: SEASONING_TYPE_NAME_MAX_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `調味料種類名は${SEASONING_TYPE_NAME_MAX_LENGTH}文字以内で入力してください`,
        path: ["name"],
      },
    ]);

    const result = SeasoningTypeAddErrorCode.fromValidationError(zodError);

    expect(result).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
  }
);

test(
  "fromValidationError: nameフィールドのcustomエラーの場合、VALIDATION_ERROR_NAME_INVALID_FORMATを返す",
  () => {
    const zodError = new ZodError([
      {
        code: "custom",
        message: "調味料種類名の形式が正しくありません",
        path: ["name"],
      },
    ]);

    const result = SeasoningTypeAddErrorCode.fromValidationError(zodError);

    expect(result).toBe("VALIDATION_ERROR_NAME_INVALID_FORMAT");
  }
);

test("fromValidationError: 未知のフィールドの場合、デフォルトエラーコードを返す", () => {
  const zodError = new ZodError([
    {
      code: "invalid_type",
      expected: "string",
      received: "number",
      message: "エラー",
      path: ["unknownField"],
    },
  ]);

  const result = SeasoningTypeAddErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_NAME_REQUIRED");
});

test("fromValidationError: 空のissuesの場合、デフォルトエラーコードを返す", () => {
  const zodError = new ZodError([]);

  const result = SeasoningTypeAddErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_NAME_REQUIRED");
});

test("定数定義: すべてのエラーコード定数が正しく定義されている", () => {
  expect(SeasoningTypeAddErrorCode.NAME_REQUIRED).toBe(
    "VALIDATION_ERROR_NAME_REQUIRED"
  );
  expect(SeasoningTypeAddErrorCode.NAME_TOO_LONG).toBe(
    "VALIDATION_ERROR_NAME_TOO_LONG"
  );
  expect(SeasoningTypeAddErrorCode.NAME_INVALID_FORMAT).toBe(
    "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  );
  expect(SeasoningTypeAddErrorCode.DUPLICATE_NAME).toBe("DUPLICATE_NAME");
  expect(SeasoningTypeAddErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
});

test("定数定義: デフォルトエラーコードが正しく設定されている", () => {
  expect(SeasoningTypeAddErrorCode.DEFAULT).toBe(
    "VALIDATION_ERROR_NAME_REQUIRED"
  );
});
