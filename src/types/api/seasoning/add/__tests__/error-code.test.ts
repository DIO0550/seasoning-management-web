import { ZodError } from "zod";
import { SeasoningAddErrorCode } from "../errorCode";

describe("SeasoningAddErrorCode", () => {
  describe("fromValidationError", () => {
    it("nameフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_NAME_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "string",
          inclusive: true,
          exact: false,
          message: "調味料名は必須です",
          path: ["name"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_REQUIRED");
    });

    it("nameフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_NAME_TOO_LONGを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 100,
          type: "string",
          inclusive: true,
          exact: false,
          message: "調味料名は100文字以内で入力してください",
          path: ["name"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
    });

    it("typeIdフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_TYPE_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "undefined",
          message: "調味料の種類を選択してください",
          path: ["typeId"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_TYPE_REQUIRED");
    });

    it("typeIdフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_TYPE_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "number",
          inclusive: true,
          exact: false,
          message: "調味料の種類を選択してください",
          path: ["typeId"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_TYPE_REQUIRED");
    });

    it("imageIdフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_IMAGE_ID_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          message: "画像の形式が無効です",
          path: ["imageId"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_IMAGE_ID_INVALID");
    });

    it("imageIdフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_IMAGE_ID_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "number",
          inclusive: true,
          exact: false,
          message: "画像IDは1以上で指定してください",
          path: ["imageId"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_IMAGE_ID_INVALID");
    });

    it("bestBeforeAtフィールドのregexエラーの場合、VALIDATION_ERROR_DATE_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_string",
          validation: "regex",
          message: "日付はYYYY-MM-DD形式で入力してください",
          path: ["bestBeforeAt"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_DATE_INVALID");
    });

    it("issuesが空の場合、DEFAULTエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe(SeasoningAddErrorCode.DEFAULT);
    });

    it("未知のフィールドの場合、DEFAULTエラーコードを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_literal" as const,
          expected: "test",
          received: "unknown",
          message: "未知のエラー",
          path: ["unknownField"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe(SeasoningAddErrorCode.DEFAULT);
    });
  });

  describe("DEFAULT", () => {
    it("DEFAULT定数がVALIDATION_ERROR_NAME_REQUIREDであること", () => {
      expect(SeasoningAddErrorCode.DEFAULT).toBe(
        "VALIDATION_ERROR_NAME_REQUIRED"
      );
    });
  });
});
