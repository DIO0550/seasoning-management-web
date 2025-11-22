import { ZodError } from "zod";
import { SeasoningListErrorCode } from "../errorCode";

describe("SeasoningListErrorCode", () => {
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

      const result = SeasoningListErrorCode.fromValidationError(zodError);

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

      const result = SeasoningListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PAGE_TOO_SMALL");
    });

    it("limitフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_LIMIT_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          message: "リミットは数値である必要があります",
          path: ["limit"],
        },
      ]);

      const result = SeasoningListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_LIMIT_INVALID");
    });

    it("limitフィールドのtoo_smallエラーの場合、VALIDATION_ERROR_LIMIT_TOO_SMALLを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_small",
          minimum: 1,
          type: "number",
          inclusive: true,
          exact: false,
          message: "リミットは1以上である必要があります",
          path: ["limit"],
        },
      ]);

      const result = SeasoningListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_LIMIT_TOO_SMALL");
    });

    it("limitフィールドのtoo_bigエラーの場合、VALIDATION_ERROR_LIMIT_TOO_LARGEを返す", () => {
      const zodError = new ZodError([
        {
          code: "too_big",
          maximum: 100,
          type: "number",
          inclusive: true,
          exact: false,
          message: "リミットは100以下である必要があります",
          path: ["limit"],
        },
      ]);

      const result = SeasoningListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_LIMIT_TOO_LARGE");
    });

    it("typeIdフィールドのinvalid_typeエラーの場合、VALIDATION_ERROR_TYPE_ID_INVALIDを返す", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          message: "調味料タイプIDは数値である必要があります",
          path: ["typeId"],
        },
      ]);

      const result = SeasoningListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_TYPE_ID_INVALID");
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

      const result = SeasoningListErrorCode.fromValidationError(zodError);

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

      const result = SeasoningListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
    });

    it("空のissuesの場合、デフォルトエラーコードを返す", () => {
      const zodError = new ZodError([]);

      const result = SeasoningListErrorCode.fromValidationError(zodError);

      expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
    });
  });

  describe("定数定義の確認", () => {
    it("すべてのエラーコード定数が正しく定義されている", () => {
      expect(SeasoningListErrorCode.PAGE_INVALID).toBe(
        "VALIDATION_ERROR_PAGE_INVALID"
      );
      expect(SeasoningListErrorCode.PAGE_TOO_SMALL).toBe(
        "VALIDATION_ERROR_PAGE_TOO_SMALL"
      );
      expect(SeasoningListErrorCode.LIMIT_INVALID).toBe(
        "VALIDATION_ERROR_LIMIT_INVALID"
      );
      expect(SeasoningListErrorCode.LIMIT_TOO_SMALL).toBe(
        "VALIDATION_ERROR_LIMIT_TOO_SMALL"
      );
      expect(SeasoningListErrorCode.LIMIT_TOO_LARGE).toBe(
        "VALIDATION_ERROR_LIMIT_TOO_LARGE"
      );
      expect(SeasoningListErrorCode.TYPE_ID_INVALID).toBe(
        "VALIDATION_ERROR_TYPE_ID_INVALID"
      );
      expect(SeasoningListErrorCode.SEARCH_INVALID).toBe(
        "VALIDATION_ERROR_SEARCH_INVALID"
      );
      expect(SeasoningListErrorCode.SEASONING_TYPE_NOT_FOUND).toBe(
        "SEASONING_TYPE_NOT_FOUND"
      );
      expect(SeasoningListErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
    });

    it("デフォルトエラーコードが正しく設定されている", () => {
      expect(SeasoningListErrorCode.DEFAULT).toBe(
        "VALIDATION_ERROR_PAGE_INVALID"
      );
    });
  });
});
