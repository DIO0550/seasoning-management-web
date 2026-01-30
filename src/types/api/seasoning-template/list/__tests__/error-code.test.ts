import { ZodError } from "zod";
import { SeasoningTemplateListErrorCode } from "../error-code";

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

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

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

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_TOO_SMALL");
});

test("fromValidationError: pageSize の invalid_type は VALIDATION_ERROR_PAGE_SIZE_INVALID を返す", () => {
  const zodError = new ZodError([
    {
      code: "invalid_type",
      expected: "number",
      received: "string",
      message: "ページサイズは数値である必要があります",
      path: ["pageSize"],
    },
  ]);

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

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
      message: "ページサイズは1以上である必要があります",
      path: ["pageSize"],
    },
  ]);

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

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
      message: "ページサイズは100以下である必要があります",
      path: ["pageSize"],
    },
  ]);

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_SIZE_TOO_LARGE");
});

test("fromValidationError: search の invalid_type は VALIDATION_ERROR_SEARCH_INVALID を返す", () => {
  const zodError = new ZodError([
    {
      code: "invalid_type",
      expected: "string",
      received: "number",
      message: "検索文字列は文字列である必要があります",
      path: ["search"],
    },
  ]);

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_SEARCH_INVALID");
});

test("fromValidationError: search の too_big は VALIDATION_ERROR_SEARCH_TOO_LONG を返す", () => {
  const zodError = new ZodError([
    {
      code: "too_big",
      maximum: 50,
      type: "string",
      inclusive: true,
      exact: false,
      message: "検索文字列は50文字以下である必要があります",
      path: ["search"],
    },
  ]);

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_SEARCH_TOO_LONG");
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

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
});

test("fromValidationError: issues が空の場合はデフォルトエラーコードを返す", () => {
  const zodError = new ZodError([]);

  const result = SeasoningTemplateListErrorCode.fromValidationError(zodError);

  expect(result).toBe("VALIDATION_ERROR_PAGE_INVALID");
});
