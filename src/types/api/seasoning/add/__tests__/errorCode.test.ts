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
          maximum: 20,
          type: "string",
          inclusive: true,
          exact: false,
          message: "調味料名は20文字以内で入力してください",
          path: ["name"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
    });

    it("nameフィールドのcustomエラーの場合、VALIDATION_ERROR_NAME_INVALID_FORMATを返す", () => {
      const zodError = new ZodError([
        {
          code: "custom",
          message: "調味料名は半角英数字で入力してください",
          path: ["name"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_INVALID_FORMAT");
    });

    it("seasoningTypeIdフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_TYPE_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "undefined",
          message: "調味料の種類を選択してください",
          path: ["seasoningTypeId"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_TYPE_REQUIRED");
    });

    it("seasoningTypeIdフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_TYPE_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "number",
          inclusive: true,
          exact: false,
          message: "調味料の種類を選択してください",
          path: ["seasoningTypeId"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_TYPE_REQUIRED");
    });

    it("imageフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_IMAGE_INVALID_TYPEを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          message: "画像の形式が無効です",
          path: ["image"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_IMAGE_INVALID_TYPE");
    });

    it("imageフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_IMAGE_TOO_LARGEを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 1000000,
          type: "string",
          inclusive: true,
          exact: false,
          message: "画像サイズが大きすぎます",
          path: ["image"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_IMAGE_TOO_LARGE");
    });

    it("issuesが空の場合、DEFAULTエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe(SeasoningAddErrorCode.DEFAULT);
    });

    it("未知のフィールドの場合、DEFAULTエラーコードを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          message: "不明なフィールドエラー",
          path: ["unknownField"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe(SeasoningAddErrorCode.DEFAULT);
    });

    it("未知のエラーコードの場合、該当フィールドのデフォルトエラーを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_literal" as const,
          expected: "test",
          received: "unknown",
          message: "未知のエラー",
          path: ["name"],
        },
      ]);

      const result = SeasoningAddErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_REQUIRED");
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
