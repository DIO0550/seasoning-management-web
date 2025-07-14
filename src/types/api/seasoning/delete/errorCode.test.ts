import { ZodError } from "zod";
import { SeasoningDeleteErrorCode } from "./errorCode";

describe("SeasoningDeleteErrorCode", () => {
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

      const result = SeasoningDeleteErrorCode.fromValidationError(zodError);

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

      const result = SeasoningDeleteErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });

    it("idフィールドの他のエラーの場合、VALIDATION_ERROR_ID_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "custom",
          message: "IDの形式が正しくありません",
          path: ["id"],
        },
      ]);

      const result = SeasoningDeleteErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_INVALID");
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

      const result = SeasoningDeleteErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });

    it("空のissuesの場合、デフォルトエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = SeasoningDeleteErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });
  });

  describe("定数定義の確認", () => {
    it("すべてのエラーコード定数が正しく定義されている", () => {
      expect(SeasoningDeleteErrorCode.ID_REQUIRED).toBe(
        "VALIDATION_ERROR_ID_REQUIRED"
      );
      expect(SeasoningDeleteErrorCode.ID_INVALID).toBe(
        "VALIDATION_ERROR_ID_INVALID"
      );
      expect(SeasoningDeleteErrorCode.SEASONING_NOT_FOUND).toBe(
        "SEASONING_NOT_FOUND"
      );
      expect(SeasoningDeleteErrorCode.SEASONING_IN_USE).toBe(
        "SEASONING_IN_USE"
      );
      expect(SeasoningDeleteErrorCode.PERMISSION_DENIED).toBe(
        "PERMISSION_DENIED"
      );
      expect(SeasoningDeleteErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
    });

    it("デフォルトエラーコードが正しく設定されている", () => {
      expect(SeasoningDeleteErrorCode.DEFAULT).toBe(
        "VALIDATION_ERROR_ID_REQUIRED"
      );
    });
  });
});
