import { ZodError } from "zod";
import { TemplateUpdateErrorCode } from "./errorCode";

describe("TemplateUpdateErrorCode", () => {
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

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

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

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

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
          message: "テンプレート名は必須です",
          path: ["name"],
        },
      ]);

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

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
          message: "テンプレート名は100文字以内で入力してください",
          path: ["name"],
        },
      ]);

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_TOO_LONG");
    });

    it("nameフィールドのcustomエラーの場合、VALIDATION_ERROR_NAME_INVALID_FORMATを返す", () => {
      const zodError = new ZodError([
        {
          code: "custom",
          message: "テンプレート名の形式が正しくありません",
          path: ["name"],
        },
      ]);

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_NAME_INVALID_FORMAT");
    });

    it("descriptionフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_DESCRIPTION_TOO_LONGを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 500,
          type: "string",
          inclusive: true,
          exact: false,
          message: "説明は500文字以内で入力してください",
          path: ["description"],
        },
      ]);

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_DESCRIPTION_TOO_LONG");
    });

    it("seasoningIdsフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_SEASONING_IDS_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "array",
          received: "string",
          message: "調味料IDは配列である必要があります",
          path: ["seasoningIds"],
        },
      ]);

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_SEASONING_IDS_INVALID");
    });

    it("seasoningIdsフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_SEASONING_IDS_EMPTYを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "array",
          inclusive: true,
          exact: false,
          message: "少なくとも1つの調味料を選択してください",
          path: ["seasoningIds"],
        },
      ]);

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_SEASONING_IDS_EMPTY");
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

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });

    it("空のissuesの場合、デフォルトエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = TemplateUpdateErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_ID_REQUIRED");
    });
  });

  describe("定数定義の確認", () => {
    it("すべてのエラーコード定数が正しく定義されている", () => {
      expect(TemplateUpdateErrorCode.ID_REQUIRED).toBe(
        "VALIDATION_ERROR_ID_REQUIRED"
      );
      expect(TemplateUpdateErrorCode.ID_INVALID).toBe(
        "VALIDATION_ERROR_ID_INVALID"
      );
      expect(TemplateUpdateErrorCode.NAME_REQUIRED).toBe(
        "VALIDATION_ERROR_NAME_REQUIRED"
      );
      expect(TemplateUpdateErrorCode.NAME_TOO_LONG).toBe(
        "VALIDATION_ERROR_NAME_TOO_LONG"
      );
      expect(TemplateUpdateErrorCode.NAME_INVALID_FORMAT).toBe(
        "VALIDATION_ERROR_NAME_INVALID_FORMAT"
      );
      expect(TemplateUpdateErrorCode.DESCRIPTION_TOO_LONG).toBe(
        "VALIDATION_ERROR_DESCRIPTION_TOO_LONG"
      );
      expect(TemplateUpdateErrorCode.SEASONING_IDS_REQUIRED).toBe(
        "VALIDATION_ERROR_SEASONING_IDS_REQUIRED"
      );
      expect(TemplateUpdateErrorCode.SEASONING_IDS_INVALID).toBe(
        "VALIDATION_ERROR_SEASONING_IDS_INVALID"
      );
      expect(TemplateUpdateErrorCode.SEASONING_IDS_EMPTY).toBe(
        "VALIDATION_ERROR_SEASONING_IDS_EMPTY"
      );
      expect(TemplateUpdateErrorCode.TEMPLATE_NOT_FOUND).toBe(
        "TEMPLATE_NOT_FOUND"
      );
      expect(TemplateUpdateErrorCode.DUPLICATE_NAME).toBe("DUPLICATE_NAME");
      expect(TemplateUpdateErrorCode.SEASONING_NOT_FOUND).toBe(
        "SEASONING_NOT_FOUND"
      );
      expect(TemplateUpdateErrorCode.PERMISSION_DENIED).toBe(
        "PERMISSION_DENIED"
      );
      expect(TemplateUpdateErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
    });

    it("デフォルトエラーコードが正しく設定されている", () => {
      expect(TemplateUpdateErrorCode.DEFAULT).toBe(
        "VALIDATION_ERROR_ID_REQUIRED"
      );
    });
  });
});
