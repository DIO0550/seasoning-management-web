import { describe, test, expect } from "vitest";
import {
  templateDeleteRequestSchema,
  templateDeleteResponseSchema,
} from "@/types/api/template/delete/schemas";

describe("Template Delete API Schemas", () => {
  describe("templateDeleteRequestSchema", () => {
    test("有効なテンプレート削除リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
      };

      expect(() =>
        templateDeleteRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("idが未指定の場合にバリデーションエラーになる", () => {
      const invalidRequest = {};

      expect(() => templateDeleteRequestSchema.parse(invalidRequest)).toThrow(
        "IDは必須です"
      );
    });

    test("idが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 0,
      };

      expect(() => templateDeleteRequestSchema.parse(invalidRequest)).toThrow(
        "IDは正の整数である必要があります"
      );
    });

    test("idが負の数の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: -1,
      };

      expect(() => templateDeleteRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("idが文字列の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: "1",
      };

      expect(() => templateDeleteRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe("templateDeleteResponseSchema", () => {
    test("有効なテンプレート削除レスポンスを受け入れる", () => {
      const validResponse = {
        result_code: "OK",
        data: {
          id: 1,
          deletedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        templateDeleteResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("result_codeが'OK'でない場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "ERROR",
        data: {
          id: 1,
          deletedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        templateDeleteResponseSchema.parse(invalidResponse)
      ).toThrow();
    });

    test("dataが未指定の場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "OK",
      };

      expect(() =>
        templateDeleteResponseSchema.parse(invalidResponse)
      ).toThrow();
    });

    test("data.idが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "OK",
        data: {
          id: 0,
          deletedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        templateDeleteResponseSchema.parse(invalidResponse)
      ).toThrow();
    });

    test("data.deletedAtが不正な日時形式の場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "OK",
        data: {
          id: 1,
          deletedAt: "invalid-datetime",
        },
      };

      expect(() =>
        templateDeleteResponseSchema.parse(invalidResponse)
      ).toThrow();
    });
  });
});
