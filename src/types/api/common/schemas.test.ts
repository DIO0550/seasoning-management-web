import { describe, test, expect } from "vitest";
import { z } from "zod";
import {
  errorResponseSchema,
  successResponseSchema,
  paginationSchema,
} from "@/types/api/common/schemas";

describe("Common API Schemas", () => {
  describe("errorResponseSchema", () => {
    test("有効なエラーレスポンスを受け入れる", () => {
      const errorCodes = ["VALIDATION_ERROR", "NOT_FOUND"] as const;
      const schema = errorResponseSchema(errorCodes);
      const validErrorResponse = {
        result_code: "VALIDATION_ERROR",
      };

      expect(() => schema.parse(validErrorResponse)).not.toThrow();
    });

    test("無効なエラーコードの場合にバリデーションエラーになる", () => {
      const errorCodes = ["VALIDATION_ERROR", "NOT_FOUND"] as const;
      const schema = errorResponseSchema(errorCodes);
      const invalidErrorResponse = {
        result_code: "INVALID_CODE",
      };

      expect(() => schema.parse(invalidErrorResponse)).toThrow();
    });
  });

  describe("successResponseSchema", () => {
    test("成功レスポンスのスキーマを正しく生成する", () => {
      const dataSchema = z.object({
        id: z.number(),
        name: z.string(),
      });

      const responseSchema = successResponseSchema(dataSchema);
      const validResponse = {
        result_code: "OK",
        data: {
          id: 1,
          name: "テスト",
        },
      };

      expect(() => responseSchema.parse(validResponse)).not.toThrow();
    });

    test("result_codeがOK以外の場合にバリデーションエラーになる", () => {
      const dataSchema = z.object({
        id: z.number(),
        name: z.string(),
      });

      const responseSchema = successResponseSchema(dataSchema);
      const invalidResponse = {
        result_code: "ERROR",
        data: {
          id: 1,
          name: "テスト",
        },
      };

      expect(() => responseSchema.parse(invalidResponse)).toThrow();
    });
  });

  describe("paginationSchema", () => {
    test("有効なページネーション情報を受け入れる", () => {
      const validPagination = {
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      };

      expect(() => paginationSchema.parse(validPagination)).not.toThrow();
    });

    test("pageが0以下の場合にバリデーションエラーになる", () => {
      const invalidPagination = {
        page: 0,
        limit: 20,
        total: 100,
        totalPages: 5,
      };

      expect(() => paginationSchema.parse(invalidPagination)).toThrow();
    });

    test("limitが0以下の場合にバリデーションエラーになる", () => {
      const invalidPagination = {
        page: 1,
        limit: 0,
        total: 100,
        totalPages: 5,
      };

      expect(() => paginationSchema.parse(invalidPagination)).toThrow();
    });
  });
});
