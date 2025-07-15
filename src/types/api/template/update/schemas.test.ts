import { describe, test, expect } from "vitest";
import {
  templateUpdateRequestSchema,
  templateUpdateResponseSchema,
} from "@/types/api/template/update/schemas";

describe("Template Update API Schemas", () => {
  describe("templateUpdateRequestSchema", () => {
    test("有効なテンプレート更新リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
        name: "朝食セット",
        description: "朝食に使う調味料セット",
        seasoningIds: [1, 2, 3],
      };

      expect(() =>
        templateUpdateRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("必須フィールドのみのテンプレート更新リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
        name: "朝食セット",
        seasoningIds: [1],
      };

      expect(() =>
        templateUpdateRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("説明がnullのテンプレート更新リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
        name: "朝食セット",
        description: null,
        seasoningIds: [1, 2],
      };

      expect(() =>
        templateUpdateRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("idが未指定の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "朝食セット",
        seasoningIds: [1],
      };

      expect(() => templateUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "IDは必須です"
      );
    });

    test("idが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 0,
        name: "朝食セット",
        seasoningIds: [1],
      };

      expect(() => templateUpdateRequestSchema.parse(invalidRequest)).toThrow();
    });

    test("nameが空文字の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "",
        seasoningIds: [1],
      };

      expect(() => templateUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "テンプレート名は必須です"
      );
    });

    test("nameが100文字を超える場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "a".repeat(101),
        seasoningIds: [1],
      };

      expect(() => templateUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "テンプレート名は100文字以内で入力してください"
      );
    });

    test("descriptionが500文字を超える場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "朝食セット",
        description: "a".repeat(501),
        seasoningIds: [1],
      };

      expect(() => templateUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "説明は500文字以内で入力してください"
      );
    });

    test("seasoningIdsが空配列の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "朝食セット",
        seasoningIds: [],
      };

      expect(() => templateUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "少なくとも1つの調味料を選択してください"
      );
    });

    test("seasoningIdsに正の整数でない値が含まれる場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "朝食セット",
        seasoningIds: [1, 0, 3],
      };

      expect(() => templateUpdateRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe("templateUpdateResponseSchema", () => {
    test("有効なテンプレート更新レスポンスを受け入れる", () => {
      const validResponse = {
        result_code: "OK",
        data: {
          id: 1,
          name: "朝食セット",
          description: "朝食に使う調味料セット",
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
              name: "塩",
              seasoningTypeId: 2,
              seasoningTypeName: "固体調味料",
              imageUrl: "/images/seasoning/2.jpg",
            },
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        templateUpdateResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("説明がnullのレスポンスを受け入れる", () => {
      const validResponse = {
        result_code: "OK",
        data: {
          id: 1,
          name: "朝食セット",
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
        templateUpdateResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("result_codeが'OK'でない場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "ERROR",
        data: {
          id: 1,
          name: "朝食セット",
          description: "朝食に使う調味料セット",
          seasonings: [],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        templateUpdateResponseSchema.parse(invalidResponse)
      ).toThrow();
    });

    test("dataが未指定の場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "OK",
      };

      expect(() =>
        templateUpdateResponseSchema.parse(invalidResponse)
      ).toThrow();
    });
  });
});
