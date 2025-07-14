import { ZodError } from "zod";
import { SeasoningTypeUpdateErrorCode } from "./errorCode";

describe("SeasoningTypeUpdateErrorCode", () => {
  describe("fromValidationError", () => {
    it("idフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_ID_REQUIREDを返す", () => {
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
    });

    it("idフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_ID_REQUIREDを返す", () => {
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
    });

    it("nameフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_NAME_REQUIREDを返す", () => {
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
    });

    it("nameフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_NAME_TOO_LONGを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 256,
          type: "string",
          inclusive: true,
          exact: false,
          message: "調味料種類名は256文字以内で入力してください",
          path: ["name"],
        },
      ]);

      const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
    });

    it("nameフィールドのcustomエラーの場合、VALIDATION_ERROR_NAME_INVALID_FORMATを返す", () => {
      const zodError = new ZodError([
        {
          code: "custom",
          message: "調味料種類名の形式が正しくありません",
          path: ["name"],
        },
      ]);

      const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_INVALID_FORMAT");
    });

    it("未知のフィールドの場合、デフォルトエラーコードを返す", () => {
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

    it("空のissuesの場合、デフォルトエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = SeasoningTypeUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });
  });

  describe("定数定義の確認", () => {
    it("すべてのエラーコード定数が正しく定義されている", () => {
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
      expect(SeasoningTypeUpdateErrorCode.DUPLICATE_NAME).toBe(
        "DUPLICATE_NAME"
      );
      expect(SeasoningTypeUpdateErrorCode.PERMISSION_DENIED).toBe(
        "PERMISSION_DENIED"
      );
      expect(SeasoningTypeUpdateErrorCode.INTERNAL_ERROR).toBe(
        "INTERNAL_ERROR"
      );
    });

    it("デフォルトエラーコードが正しく設定されている", () => {
      expect(SeasoningTypeUpdateErrorCode.DEFAULT).toBe(
        "VALIDATION_ERROR_ID_REQUIRED"
      );
    });
  });
});
