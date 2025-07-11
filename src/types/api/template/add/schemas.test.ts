import { describe, test, expect } from "vitest";
import { templateAddRequestSchema, templateAddResponseSchema } from "@/types/api/template/add/schemas";

describe("Template Add API Schemas", () => {
  describe("templateAddRequestSchema", () => {
    test("有効なテンプレート追加リクエストを受け入れる", () => {
      const validRequest = {
        name: "和食の基本",
        description: "和食に必要な基本的な調味料セット",
        seasoningIds: [1, 2, 3],
      };

      expect(() => templateAddRequestSchema.parse(validRequest)).not.toThrow();
    });

    test("descriptionがnullの場合も受け入れる", () => {
      const validRequest = {
        name: "和食の基本",
        description: null,
        seasoningIds: [1, 2, 3],
      };

      expect(() => templateAddRequestSchema.parse(validRequest)).not.toThrow();
    });

    test("nameが空文字の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "",
        description: "和食に必要な基本的な調味料セット",
        seasoningIds: [1, 2, 3],
      };

      expect(() => templateAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("nameが100文字を超える場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "a".repeat(101),
        description: "和食に必要な基本的な調味料セット",
        seasoningIds: [1, 2, 3],
      };

      expect(() => templateAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("descriptionが500文字を超える場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "和食の基本",
        description: "a".repeat(501),
        seasoningIds: [1, 2, 3],
      };

      expect(() => templateAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("seasoningIdsが空配列の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "和食の基本",
        description: "和食に必要な基本的な調味料セット",
        seasoningIds: [],
      };

      expect(() => templateAddRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("seasoningIdsに0以下の値が含まれる場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "和食の基本",
        description: "和食に必要な基本的な調味料セット",
        seasoningIds: [1, 0, 3],
      };

      expect(() => templateAddRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe("templateAddResponseSchema", () => {
    test("有効なテンプレート追加レスポンスを受け入れる", () => {
      const validResponse = {
        success: true,
        data: {
          id: 1,
          name: "和食の基本",
          description: "和食に必要な基本的な調味料セット",
          seasonings: [
            {
              id: 1,
              name: "醤油",
              seasoningTypeId: 1,
              seasoningTypeName: "液体調味料",
              imageUrl: null,
            },
            {
              id: 2,
              name: "味噌",
              seasoningTypeId: 2,
              seasoningTypeName: "発酵調味料",
              imageUrl: null,
            },
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        templateAddResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("descriptionがnullのレスポンスを受け入れる", () => {
      const validResponse = {
        success: true,
        data: {
          id: 1,
          name: "和食の基本",
          description: null,
          seasonings: [
            {
              id: 1,
              name: "醤油",
              seasoningTypeId: 1,
              seasoningTypeName: "液体調味料",
              imageUrl: null,
            },
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        templateAddResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("successがfalseの場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        success: false,
        data: {
          id: 1,
          name: "和食の基本",
          description: "和食に必要な基本的な調味料セット",
          seasonings: [],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() => templateAddResponseSchema.parse(invalidResponse)).toThrow();
    });
  });
});
