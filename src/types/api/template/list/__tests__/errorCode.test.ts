import { ZodError } from "zod";
import { TemplateListErrorCode } from "../errorCode";

describe("TemplateListErrorCode", () => {
  describe("fromValidationError", () => {
    it("pageフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_PAGE_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          message: "ページ番号は数値である必要があります",
          path: ["page"],
        },
      ]);

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
    });

    it("pageフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_PAGE_TOO_SMALLを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "number",
          inclusive: true,
          exact: false,
          message: "ページ番号は1以上である必要があります",
          path: ["page"],
        },
      ]);

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PAGE_TOO_SMALL");
    });

    it("pageSizeフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_LIMIT_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          message: "ページサイズは数値である必要があります",
          path: ["pageSize"],
        },
      ]);

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_LIMIT_INVALID");
    });

    it("pageSizeフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_LIMIT_TOO_SMALLを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "number",
          inclusive: true,
          exact: false,
          message: "ページサイズは1以上である必要があります",
          path: ["pageSize"],
        },
      ]);

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_LIMIT_TOO_SMALL");
    });

    it("pageSizeフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_LIMIT_TOO_LARGEを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 100,
          type: "number",
          inclusive: true,
          exact: false,
          message: "ページサイズは100以下である必要があります",
          path: ["pageSize"],
        },
      ]);

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_LIMIT_TOO_LARGE");
    });

    it("searchフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_SEARCH_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          message: "検索条件は文字列である必要があります",
          path: ["search"],
        },
      ]);

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_SEARCH_INVALID");
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

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
    });

    it("空のissuesの場合、デフォルトエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = TemplateListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
    });
  });

  describe("定数定義の確認", () => {
    it("すべてのエラーコード定数が正しく定義されている", () => {
      expect(TemplateListErrorCode.PAGE_INVALID).toBe(
        "VALIDATION_ERROR_PAGE_INVALID"
      );
      expect(TemplateListErrorCode.PAGE_TOO_SMALL).toBe(
        "VALIDATION_ERROR_PAGE_TOO_SMALL"
      );
      expect(TemplateListErrorCode.LIMIT_INVALID).toBe(
        "VALIDATION_ERROR_LIMIT_INVALID"
      );
      expect(TemplateListErrorCode.LIMIT_TOO_SMALL).toBe(
        "VALIDATION_ERROR_LIMIT_TOO_SMALL"
      );
      expect(TemplateListErrorCode.LIMIT_TOO_LARGE).toBe(
        "VALIDATION_ERROR_LIMIT_TOO_LARGE"
      );
      expect(TemplateListErrorCode.SEARCH_INVALID).toBe(
        "VALIDATION_ERROR_SEARCH_INVALID"
      );
      expect(TemplateListErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
    });

    it("デフォルトエラーコードが正しく設定されている", () => {
      expect(TemplateListErrorCode.DEFAULT).toBe(
        "VALIDATION_ERROR_PAGE_INVALID"
      );
    });
  });
});
