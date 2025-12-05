import { test, expect } from "vitest";
import {
  seasoningListQuerySchema,
  seasoningListResponseSchema,
} from "@/types/api/seasoning/list/types";

test("seasoningListQuerySchema: 基本的なクエリを受け入れる", () => {
  const payload = {
    page: 1,
    pageSize: 20,
    typeId: 2,
    search: "醤油",
    sort: "expiryAsc",
  };

  expect(() => seasoningListQuerySchema.parse(payload)).not.toThrow();
});

test("seasoningListQuerySchema: 文字列の数値を変換する", () => {
  const payload = {
    page: "2",
    pageSize: "50",
    typeId: "3",
    expiresWithinDays: "7",
  };

  const result = seasoningListQuerySchema.parse(payload);
  expect(result.page).toBe(2);
  expect(result.pageSize).toBe(50);
  expect(result.typeId).toBe(3);
  expect(result.expiresWithinDays).toBe(7);
});

test("seasoningListQuerySchema: page は1未満で失敗する", () => {
  expect(() =>
    seasoningListQuerySchema.parse({ page: 0, pageSize: 10 })
  ).toThrow();
});

test("seasoningListResponseSchema: メタ情報付き一覧を受け入れる", () => {
  const payload = {
    data: [
      {
        id: 1,
        name: "醤油",
        typeId: 2,
        imageId: null,
        bestBeforeAt: "2024-01-01",
        expiresAt: null,
        purchasedAt: "2023-12-01",
        daysUntilExpiry: 10,
        expiryStatus: "expiring_soon",
      },
    ],
    meta: {
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
    summary: {
      totalCount: 1,
      expiringCount: 1,
      expiredCount: 0,
    },
  };

  expect(() => seasoningListResponseSchema.parse(payload)).not.toThrow();
});
