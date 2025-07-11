import { describe, test, expect } from "vitest";
import {
  seasoningListResponseSchema,
  seasoningListQuerySchema,
} from "@/types/api/seasoning/list/schemas";

describe("Seasoning List API Schemas", () => {
  describe("seasoningListQuerySchema", () => {
    test("有効なクエリパラメータを受け入れる", () => {
      const validQuery = {
        page: 1,
        limit: 20,
        seasoningTypeId: null,
        search: null,
      };

      expect(() => seasoningListQuerySchema.parse(validQuery)).not.toThrow();
    });

    test("検索条件ありのクエリパラメータを受け入れる", () => {
      const validQuery = {
        page: 2,
        limit: 10,
        seasoningTypeId: 1,
        search: "醤油",
      };

      expect(() => seasoningListQuerySchema.parse(validQuery)).not.toThrow();
    });

    test("pageが0以下の場合にバリデーションエラーになる", () => {
      const invalidQuery = {
        page: 0,
        limit: 20,
        seasoningTypeId: null,
        search: null,
      };

      expect(() => seasoningListQuerySchema.parse(invalidQuery)).toThrow();
    });

    test("limitが0以下の場合にバリデーションエラーになる", () => {
      const invalidQuery = {
        page: 1,
        limit: 0,
        seasoningTypeId: null,
        search: null,
      };

      expect(() => seasoningListQuerySchema.parse(invalidQuery)).toThrow();
    });

    test("limitが100を超える場合にバリデーションエラーになる", () => {
      const invalidQuery = {
        page: 1,
        limit: 101,
        seasoningTypeId: null,
        search: null,
      };

      expect(() => seasoningListQuerySchema.parse(invalidQuery)).toThrow();
    });
  });

  describe("seasoningListResponseSchema", () => {
    test("有効な調味料一覧レスポンスを受け入れる", () => {
      const validResponse = {
        success: true,
        data: {
          items: [
            {
              id: 1,
              name: "醤油",
              seasoningTypeId: 1,
              seasoningTypeName: "液体調味料",
              imageUrl: null,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
            },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        },
      };

      expect(() =>
        seasoningListResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("空の一覧レスポンスを受け入れる", () => {
      const validResponse = {
        success: true,
        data: {
          items: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        },
      };

      expect(() =>
        seasoningListResponseSchema.parse(validResponse)
      ).not.toThrow();
    });

    test("successがfalseの場合にバリデーションエラーになる", () => {
      const invalidResponse = {
        success: false,
        data: {
          items: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        },
      };

      expect(() =>
        seasoningListResponseSchema.parse(invalidResponse)
      ).toThrow();
    });
  });
});
