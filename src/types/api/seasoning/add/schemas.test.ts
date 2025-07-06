import { describe, test, expect } from "vitest";
import {
  seasoningAddRequestSchema,
  seasoningAddResponseSchema,
} from "./schemas";

describe("Seasoning Add API Schemas", () => {
  describe("seasoningAddRequestSchema", () => {
    test("有効な調味料追加リクエストを受け入れる", () => {
      const validRequest = {
        name: "醤油",
        seasoningTypeId: 1,
        image: null,
      };

      expect(() => seasoningAddRequestSchema.parse(validRequest)).not.toThrow();
    });

    test("画像ありの調味料追加リクエストを受け入れる", () => {
      const validRequest = {
        name: "醤油",
        seasoningTypeId: 1,
        image: "base64encodedimage",
      };

      expect(() => seasoningAddRequestSchema.parse(validRequest)).not.toThrow();
    });

    test("nameが空文字の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "",
        seasoningTypeId: 1,
        image: null,
      };

      expect(() => seasoningAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("nameが50文字を超える場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "a".repeat(51),
        seasoningTypeId: 1,
        image: null,
      };

      expect(() => seasoningAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("seasoningTypeIdが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "醤油",
        seasoningTypeId: 0,
        image: null,
      };

      expect(() => seasoningAddRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe("seasoningAddResponseSchema", () => {
    test("有効な調味料追加レスポンスを受け入れる", () => {
      const validResponse = {
        success: true,
        data: {
          id: 1,
          name: "醤油",
          seasoningTypeId: 1,
          seasoningTypeName: "液体調味料",
          imageUrl: null,
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
        success: true,
        data: {
          id: 1,
          name: "醤油",
          seasoningTypeId: 1,
          seasoningTypeName: "液体調味料",
          imageUrl: "/images/seasoning/1.jpg",
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
        success: false,
        data: {
          id: 1,
          name: "醤油",
          seasoningTypeId: 1,
          seasoningTypeName: "液体調味料",
          imageUrl: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() => seasoningAddResponseSchema.parse(invalidResponse)).toThrow();
    });
  });
});
