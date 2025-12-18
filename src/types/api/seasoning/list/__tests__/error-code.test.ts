import { ZodError } from "zod";
import { SeasoningListErrorCode } from "../error-code";

test("fromValidationError: page の invalid_type は VALIDATION_ERROR_PAGE_INVALID を返す", () => {
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

test("fromValidationError: page の too_small は VALIDATION_ERROR_PAGE_TOO_SMALL を返す", () => {
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

test("fromValidationError: pageSize の invalid_type は VALIDATION_ERROR_PAGE_SIZE_INVALID を返す", () => {
  const zodError = new ZodError([
    {
      code: "invalid_type",
      expected: "number",
      received: "string",
      message: "リミットは数値である必要があります",
      path: ["pageSize"],
    },
  ]);

  const result = SeasoningListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_SIZE_INVALID");
});

test("fromValidationError: pageSize の too_small は VALIDATION_ERROR_PAGE_SIZE_TOO_SMALL を返す", () => {
  const zodError = new ZodError([
    {
      code: "too_small",
      minimum: 1,
      type: "number",
      inclusive: true,
      exact: false,
      message: "リミットは1以上である必要があります",
      path: ["pageSize"],
    },
  ]);

  const result = SeasoningListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_SIZE_TOO_SMALL");
});

test("fromValidationError: pageSize の too_big は VALIDATION_ERROR_PAGE_SIZE_TOO_LARGE を返す", () => {
  const zodError = new ZodError([
    {
      code: "too_big",
      maximum: 100,
      type: "number",
      inclusive: true,
      exact: false,
      message: "リミットは100以下である必要があります",
      path: ["pageSize"],
    },
  ]);

  const result = SeasoningListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_SIZE_TOO_LARGE");
});

test("fromValidationError: typeId の invalid_type は VALIDATION_ERROR_TYPE_ID_INVALID を返す", () => {
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

test("fromValidationError: search の invalid_type は VALIDATION_ERROR_SEARCH_INVALID を返す", () => {
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

test("fromValidationError: 未知フィールドの場合はデフォルトエラーコードを返す", () => {
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

test("fromValidationError: issues が空の場合はデフォルトエラーコードを返す", () => {
  const zodError = new ZodError([]);

  const result = SeasoningListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
});

test("定数定義: すべてのエラーコードが期待通り", () => {
  expect(SeasoningListErrorCode.PAGE_INVALID).toBe(
    "VALIDATION_ERROR_PAGE_INVALID"
  );
  expect(SeasoningListErrorCode.PAGE_TOO_SMALL).toBe(
    "VALIDATION_ERROR_PAGE_TOO_SMALL"
  );
  expect(SeasoningListErrorCode.PAGE_SIZE_INVALID).toBe(
    "VALIDATION_ERROR_PAGE_SIZE_INVALID"
  );
  expect(SeasoningListErrorCode.PAGE_SIZE_TOO_SMALL).toBe(
    "VALIDATION_ERROR_PAGE_SIZE_TOO_SMALL"
  );
  expect(SeasoningListErrorCode.PAGE_SIZE_TOO_LARGE).toBe(
    "VALIDATION_ERROR_PAGE_SIZE_TOO_LARGE"
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

test("定数定義: デフォルトエラーコードは VALIDATION_ERROR_PAGE_INVALID", () => {
  expect(SeasoningListErrorCode.DEFAULT).toBe("VALIDATION_ERROR_PAGE_INVALID");
});
