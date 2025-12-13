import { describe, expect, test } from "vitest";
import {
  seasoningPurchaseRequestSchema,
  seasoningPurchaseResponseSchema,
} from "@/types/api/seasoning/purchase/schemas";

describe("Seasoning Purchase API Schemas", () => {
  describe("seasoningPurchaseRequestSchema", () => {
    test("必須項目のみのリクエストを受け入れる", () => {
      const result = seasoningPurchaseRequestSchema.safeParse({
        name: "醤油",
        typeId: 1,
        purchasedAt: "2025-12-13",
      });

      expect(result.success).toBe(true);
    });

    test("全項目を含むリクエストを受け入れる", () => {
      const result = seasoningPurchaseRequestSchema.safeParse({
        name: "濃口醤油",
        typeId: 1,
        purchasedAt: "2025-12-10",
        expiresAt: "2026-12-10",
        bestBeforeAt: "2026-06-10",
        imageId: 5,
      });

      expect(result.success).toBe(true);
    });

    test("任意項目を省略したリクエストを受け入れる", () => {
      const result = seasoningPurchaseRequestSchema.safeParse({
        name: "醤油",
        typeId: 1,
        purchasedAt: "2025-12-13",
        expiresAt: null,
        bestBeforeAt: null,
        imageId: null,
      });

      expect(result.success).toBe(true);
    });

    test("purchasedAt が未指定だとバリデーションエラーになる", () => {
      const result = seasoningPurchaseRequestSchema.safeParse({
        name: "醤油",
        typeId: 1,
      });

      expect(result.success).toBe(false);
    });

    test("purchasedAt の形式が不正だとバリデーションエラーになる", () => {
      const result = seasoningPurchaseRequestSchema.safeParse({
        name: "醤油",
        typeId: 1,
        purchasedAt: "2025/12/13",
      });

      expect(result.success).toBe(false);
    });

    test("purchasedAt が未来日付だとバリデーションエラーになる", () => {
      const result = seasoningPurchaseRequestSchema.safeParse({
        name: "醤油",
        typeId: 1,
        purchasedAt: "2030-01-01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("seasoningPurchaseResponseSchema", () => {
    test("有効なレスポンスを受け入れる", () => {
      const result = seasoningPurchaseResponseSchema.safeParse({
        data: {
          id: 1,
          name: "醤油",
          typeId: 1,
          typeName: "液体調味料",
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: "2025-12-13",
          createdAt: "2025-12-13T00:00:00.000Z",
          updatedAt: "2025-12-13T00:00:00.000Z",
        },
      });

      expect(result.success).toBe(true);
    });

    test("purchasedAt が null の場合はバリデーションエラーになる", () => {
      const result = seasoningPurchaseResponseSchema.safeParse({
        data: {
          id: 1,
          name: "醤油",
          typeId: 1,
          typeName: "液体調味料",
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
          createdAt: "2025-12-13T00:00:00.000Z",
          updatedAt: "2025-12-13T00:00:00.000Z",
        },
      });

      expect(result.success).toBe(false);
    });
  });
});
