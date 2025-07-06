import { describe, test, expect } from "vitest";
import { z } from "zod";
import {
  errorResponseSchema,
  successResponseSchema,
  paginationSchema,
} from "./schemas";

describe("Common API Schemas", () => {
  describe("errorResponseSchema", () => {
    test("有効なエラーレスポンスを受け入れる", () => {
      const validErrorResponse = {
        error: true,
        message: "エラーが発生しました",
        code: "VALIDATION_ERROR",
      };

      expect(() => errorResponseSchema.parse(validErrorResponse)).not.toThrow();
    });

    test("messageが空文字の場合にバリデーションエラーになる", () => {
      const invalidErrorResponse = {
        error: true,
        message: "",
        code: "VALIDATION_ERROR",
      };

      expect(() => errorResponseSchema.parse(invalidErrorResponse)).toThrow();
    });

    test("errorがfalseの場合にバリデーションエラーになる", () => {
      const invalidErrorResponse = {
        error: false,
        message: "エラーが発生しました",
        code: "VALIDATION_ERROR",
      };

      expect(() => errorResponseSchema.parse(invalidErrorResponse)).toThrow();
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
        success: true,
        data: {
          id: 1,
          name: "テスト",
        },
      };

      expect(() => responseSchema.parse(validResponse)).not.toThrow();
    });

    test("successがfalseの場合にバリデーションエラーになる", () => {
      const dataSchema = z.object({
        id: z.number(),
        name: z.string(),
      });

      const responseSchema = successResponseSchema(dataSchema);
      const invalidResponse = {
        success: false,
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
