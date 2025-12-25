import { expect, test } from "vitest";
import { ZodError } from "zod";
import { SeasoningTypeUpdateErrorCode } from "../error-code";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";

test(
  "fromValidationError: idフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_ID_REQUIREDを返す",
  () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "number",
        received: "string",
        message: "IDは数値である必要があります",
        path: ["id"],
      },
    ]);

    const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

    expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
  }
);

test(
  "fromValidationError: idフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_ID_REQUIREDを返す",
  () => {
    const zodError = new ZodError([
      {
        code: "too_small",
        minimum: 1,
        type: "number",
        inclusive: true,
        exact: false,
        message: "IDは1以上である必要があります",
        path: ["id"],
      },
    ]);

    const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

    expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
  }
);

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

    const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

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

    const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

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

    const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

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

  const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
});

test("fromValidationError: 空のissuesの場合、デフォルトエラーコードを返す", () => {
  const zodError = new ZodError([]);

  const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
});

test("定数定義: すべてのエラーコード定数が正しく定義されている", () => {
  expect(SeasoningTypeUpdateErrorCode.ID_REQUIRED).toBe(
    "VALIDATION_ERROR_ID_REQUIRED"
  );
  expect(SeasoningTypeUpdateErrorCode.ID_INVALID).toBe(
    "VALIDATION_ERROR_ID_INVALID"
  );
  expect(SeasoningTypeUpdateErrorCode.NAME_REQUIRED).toBe(
    "VALIDATION_ERROR_NAME_REQUIRED"
  );
  expect(SeasoningTypeUpdateErrorCode.NAME_TOO_LONG).toBe(
    "VALIDATION_ERROR_NAME_TOO_LONG"
  );
  expect(SeasoningTypeUpdateErrorCode.NAME_INVALID_FORMAT).toBe(
    "VALIDATION_ERROR_NAME_INVALID_FORMAT"
  );
  expect(SeasoningTypeUpdateErrorCode.SEASONING_TYPE_NOT_FOUND).toBe(
    "SEASONING_TYPE_NOT_FOUND"
  );
  expect(SeasoningTypeUpdateErrorCode.DUPLICATE_NAME).toBe("DUPLICATE_NAME");
  expect(SeasoningTypeUpdateErrorCode.PERMISSION_DENIED).toBe(
    "PERMISSION_DENIED"
  );
  expect(SeasoningTypeUpdateErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
});

test("定数定義: デフォルトエラーコードが正しく設定されている", () => {
  expect(SeasoningTypeUpdateErrorCode.DEFAULT).toBe(
    "VALIDATION_ERROR_ID_REQUIRED"
  );
});
