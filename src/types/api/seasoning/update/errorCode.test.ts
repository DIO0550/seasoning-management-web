import { ZodError } from "zod";
import { SeasoningUpdateErrorCode } from "./errorCode";

describe("SeasoningUpdateErrorCode", () => {
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

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

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

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

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
          message: "調味料名は必須です",
          path: ["name"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

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
          message: "調味料名は256文字以内で入力してください",
          path: ["name"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
    });

    it("nameフィールドのcustomエラーの場合、VALIDATION_ERROR_NAME_INVALID_FORMATを返す", () => {
      const zodError = new ZodError([
        {
          code: "custom",
          message: "調味料名の形式が正しくありません",
          path: ["name"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_INVALID_FORMAT");
    });

    it("seasoningTypeIdフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_TYPE_REQUIREDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          message: "調味料タイプIDは数値である必要があります",
          path: ["seasoningTypeId"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_TYPE_REQUIRED");
    });

    it("imageフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_IMAGE_INVALID_TYPEを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "object",
          received: "string",
          message: "画像は適切な形式である必要があります",
          path: ["image"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_IMAGE_INVALID_TYPE");
    });

    it("imageフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_IMAGE_TOO_LARGEを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 5000000,
          type: "string",
          inclusive: true,
          exact: false,
          message: "画像ファイルサイズが大きすぎます",
          path: ["image"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_IMAGE_TOO_LARGE");
    });

    it("bestBeforeAtフィールドのinvalid_dateエラーの場合、VALIDATION_ERROR_DATE_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_date",
          message: "日付の形式が正しくありません",
          path: ["bestBeforeAt"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_DATE_INVALID");
    });

    it("expiresAtフィールドのinvalid_stringエラーの場合、VALIDATION_ERROR_DATE_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_string",
          validation: "datetime",
          message: "日付の形式が正しくありません",
          path: ["expiresAt"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_DATE_INVALID");
    });

    it("purchasedAtフィールドの日付エラーの場合、VALIDATION_ERROR_DATE_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_date",
          message: "購入日の形式が正しくありません",
          path: ["purchasedAt"],
        },
      ]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_DATE_INVALID");
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

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });

    it("空のissuesの場合、デフォルトエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = SeasoningUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });
  });

  describe("定数定義の確認", () => {
    it("すべてのエラーコード定数が正しく定義されている", () => {
      expect(SeasoningUpdateErrorCode.ID_REQUIRED).toBe(
        "VALIDATION_ERROR_ID_REQUIRED"
      );
      expect(SeasoningUpdateErrorCode.ID_INVALID).toBe(
        "VALIDATION_ERROR_ID_INVALID"
      );
      expect(SeasoningUpdateErrorCode.NAME_REQUIRED).toBe(
        "VALIDATION_ERROR_NAME_REQUIRED"
      );
      expect(SeasoningUpdateErrorCode.NAME_TOO_LONG).toBe(
        "VALIDATION_ERROR_NAME_TOO_LONG"
      );
      expect(SeasoningUpdateErrorCode.NAME_INVALID_FORMAT).toBe(
        "VALIDATION_ERROR_NAME_INVALID_FORMAT"
      );
      expect(SeasoningUpdateErrorCode.TYPE_REQUIRED).toBe(
        "VALIDATION_ERROR_TYPE_REQUIRED"
      );
      expect(SeasoningUpdateErrorCode.IMAGE_INVALID_TYPE).toBe(
        "VALIDATION_ERROR_IMAGE_INVALID_TYPE"
      );
      expect(SeasoningUpdateErrorCode.IMAGE_TOO_LARGE).toBe(
        "VALIDATION_ERROR_IMAGE_TOO_LARGE"
      );
      expect(SeasoningUpdateErrorCode.DATE_INVALID).toBe(
        "VALIDATION_ERROR_DATE_INVALID"
      );
      expect(SeasoningUpdateErrorCode.SEASONING_NOT_FOUND).toBe(
        "SEASONING_NOT_FOUND"
      );
      expect(SeasoningUpdateErrorCode.DUPLICATE_NAME).toBe("DUPLICATE_NAME");
      expect(SeasoningUpdateErrorCode.PERMISSION_DENIED).toBe(
        "PERMISSION_DENIED"
      );
      expect(SeasoningUpdateErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
    });

    it("デフォルトエラーコードが正しく設定されている", () => {
      expect(SeasoningUpdateErrorCode.DEFAULT).toBe(
        "VALIDATION_ERROR_ID_REQUIRED"
      );
    });
  });
});
