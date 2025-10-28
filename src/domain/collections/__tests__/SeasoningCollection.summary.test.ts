/**
 * SeasoningCollections のサマリー計算テスト
 */

import { test, expect } from "vitest";
import { SeasoningCollections } from "../SeasoningCollection";
import { createMockItem } from "./SeasoningCollection.test-helpers";

test("calculateSummary は総数と期限ステータス別件数を集計する", () => {
  const items = [
    createMockItem(1, "醤油", 10, "fresh"),
    createMockItem(2, "味噌", 5, "expiring_soon"),
    createMockItem(3, "みりん", -1, "expired"),
    createMockItem(4, "塩", 3, "expiring_soon"),
  ];
  const collection = SeasoningCollections.from(items);

  const summary = SeasoningCollections.calculateSummary(collection);

  expect(summary.totalCount).toBe(4);
  expect(summary.expiringCount).toBe(2);
  expect(summary.expiredCount).toBe(1);
});
