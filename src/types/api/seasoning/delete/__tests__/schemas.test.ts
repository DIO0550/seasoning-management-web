import { describe, test, expect } from "vitest";
import {
  seasoningDeleteRequestSchema,
  seasoningDeleteResponseSchema,
} from "@/types/api/seasoning/delete/schemas";

describe("Seasoning Delete API Schemas", () => {
  describe("seasoningDeleteRequestSchema", () => {
    test("有効な調味料削除リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
      };

      expect(() =>
        seasoningDeleteRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("idが未指定の場合にバリデーションエラーになる", () => {
      const invalidRequest = {};

      expect(() => seasoningDeleteRequestSchema.parse(invalidRequest)).toThrow(
        "IDは必須です"
      );
    });

    test("idが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 0,
      };

      expect(() => seasoningDeleteRequestSchema.parse(invalidRequest)).toThrow(
        "IDは正の整数である必要があります"
      );
    });

    test("idが負の数の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: -1,
      };

      expect(() =>
        seasoningDeleteRequestSchema.parse(invalidRequest)
      ).toThrow();
    });

    test("idが文字列の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: "1",
      };

      expect(() =>
        seasoningDeleteRequestSchema.parse(invalidRequest)
      ).toThrow();
    });
  });

  describe("seasoningDeleteResponseSchema", () => {
    test("有効な調味料削除レスポンスを受け入れる", () => {
      const validResponse = {
        data: {
          id: 1,
          deletedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        seasoningDeleteResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("dataが未指定の場合にバリデーションエラーになる", () => {
      const invalidResponse = {};

      expect(() =>
        seasoningDeleteResponseSchema.parse(invalidResponse)
      ).toThrow();
    });

    test("data.idが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        data: {
          id: 0,
          deletedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        seasoningDeleteResponseSchema.parse(invalidResponse)
      ).toThrow();
    });

    test("data.deletedAtが不正な日時形式の場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        data: {
          id: 1,
          deletedAt: "invalid-datetime",
        },
      };

      expect(() =>
        seasoningDeleteResponseSchema.parse(invalidResponse)
      ).toThrow();
    });
  });
});
