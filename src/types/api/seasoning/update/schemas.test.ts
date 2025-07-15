import { describe, test, expect } from "vitest";
import {
  seasoningUpdateRequestSchema,
  seasoningUpdateResponseSchema,
} from "@/types/api/seasoning/update/schemas";

describe("Seasoning Update API Schemas", () => {
  describe("seasoningUpdateRequestSchema", () => {
    test("有効な調味料更新リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
        name: "soysauce",
        seasoningTypeId: 1,
        image: null,
        bestBeforeAt: "2024-12-31",
        expiresAt: "2024-11-30",
        purchasedAt: "2024-01-01",
      };

      expect(() =>
        seasoningUpdateRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("必須フィールドのみの調味料更新リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
        name: "soysauce",
        seasoningTypeId: 1,
      };

      expect(() =>
        seasoningUpdateRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("画像ありの調味料更新リクエストを受け入れる", () => {
      const validRequest = {
        id: 1,
        name: "soysauce",
        seasoningTypeId: 1,
        image: "base64encodedimage",
      };

      expect(() =>
        seasoningUpdateRequestSchema.parse(validRequest)
      ).not.toThrow();
    });

    test("idが未指定の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        name: "soysauce",
        seasoningTypeId: 1,
      };

      expect(() => seasoningUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "IDは必須です"
      );
    });

    test("idが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 0,
        name: "soysauce",
        seasoningTypeId: 1,
      };

      expect(() =>
        seasoningUpdateRequestSchema.parse(invalidRequest)
      ).toThrow();
    });

    test("nameが空文字の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "",
        seasoningTypeId: 1,
      };

      expect(() => seasoningUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "調味料名は必須です"
      );
    });

    test("nameが20文字を超える場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "a".repeat(21),
        seasoningTypeId: 1,
      };

      expect(() => seasoningUpdateRequestSchema.parse(invalidRequest)).toThrow(
        "調味料名は20文字以内で入力してください"
      );
    });

    test("seasoningTypeIdが正の整数でない場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "soysauce",
        seasoningTypeId: 0,
      };

      expect(() =>
        seasoningUpdateRequestSchema.parse(invalidRequest)
      ).toThrow();
    });

    test("不正な日付形式の場合にバリデーションエラーになる", () => {
      const invalidRequest = {
        id: 1,
        name: "soysauce",
        seasoningTypeId: 1,
        bestBeforeAt: "invalid-date",
      };

      expect(() =>
        seasoningUpdateRequestSchema.parse(invalidRequest)
      ).toThrow();
    });
  });

  describe("seasoningUpdateResponseSchema", () => {
    test("有効な調味料更新レスポンスを受け入れる", () => {
      const validResponse = {
        result_code: "OK",
        data: {
          id: 1,
          name: "醤油",
          seasoningTypeId: 1,
          seasoningTypeName: "液体調味料",
          imageUrl: null,
          bestBeforeAt: "2024-12-31",
          expiresAt: "2024-11-30",
          purchasedAt: "2024-01-01",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        seasoningUpdateResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("画像URLありのレスポンスを受け入れる", () => {
      const validResponse = {
        result_code: "OK",
        data: {
          id: 1,
          name: "醤油",
          seasoningTypeId: 1,
          seasoningTypeName: "液体調味料",
          imageUrl: "/images/seasoning/1.jpg",
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        seasoningUpdateResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("result_codeが'OK'でない場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "ERROR",
        data: {
          id: 1,
          name: "醤油",
          seasoningTypeId: 1,
          seasoningTypeName: "液体調味料",
          imageUrl: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      };

      expect(() =>
        seasoningUpdateResponseSchema.parse(invalidResponse)
      ).toThrow();
    });

    test("dataが未指定の場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        result_code: "OK",
      };

      expect(() =>
        seasoningUpdateResponseSchema.parse(invalidResponse)
      ).toThrow();
    });
  });
});
