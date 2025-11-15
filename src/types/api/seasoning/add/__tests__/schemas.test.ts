import { describe, test, expect } from "vitest";
import {
  seasoningAddRequestSchema,
  seasoningAddResponseSchema,
} from "@/types/api/seasoning/add/schemas";

describe("Seasoning Add API Schemas", () => {
  describe("seasoningAddRequestSchema", () => {
    test("有効な調味料追加リクエストを受け入れる", () => {
      const validRequest = {
        name: "醤油",
        typeId: 1,
        imageId: null,
      };

      expect(() => seasoningAddRequestSchema.parse(validRequest)).not.toThrow();
    });

    test("画像ありの調味料追加リクエストを受け入れる", () => {
      const validRequest = {
        name: "soysauce",
        typeId: 1,
        imageId: 12,
        bestBeforeAt: "2025-12-01",
        expiresAt: "2025-12-20",
        purchasedAt: "2025-11-01",
      };

      expect(() => seasoningAddRequestSchema.parse(validRequest)).not.toThrow();
    });

    test("nameが空文字の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "",
        typeId: 1,
        imageId: null,
      };

      expect(() => seasoningAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("nameが50文字を超える場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "a".repeat(101),
        typeId: 1,
        imageId: null,
      };

      expect(() => seasoningAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("seasoningTypeIdが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "soysauce",
        typeId: 0,
        imageId: null,
      };

      expect(() => seasoningAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("bestBeforeAtが日付形式でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "soysauce",
        typeId: 1,
        bestBeforeAt: "2025/12/01",
      };

      expect(() => seasoningAddRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe("seasoningAddResponseSchema", () => {
    test("有効な調味料追加レスポンスを受け入れる", () => {
      const validResponse = {
        data: {
          id: 1,
          name: "醤油",
          typeId: 1,
          typeName: "液体調味料",
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        seasoningAddResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("画像URLありのレスポンスを受け入れる", () => {
      const validResponse = {
        data: {
          id: 1,
          name: "醤油",
          typeId: 1,
          typeName: "液体調味料",
          imageId: 10,
          bestBeforeAt: "2025-12-01",
          expiresAt: "2025-12-20",
          purchasedAt: "2025-11-01",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        seasoningAddResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("successがfalseの場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        data: {
          id: "invalid",
          name: "醤油",
          typeId: 1,
          typeName: "液体調味料",
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() => seasoningAddResponseSchema.parse(invalidResponse)).toThrow();
    });
  });
});
