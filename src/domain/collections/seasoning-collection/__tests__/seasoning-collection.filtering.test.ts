/**
 * SeasoningCollections のフィルタリング操作テスト
 */

import { test, expect } from "vitest";
import { SeasoningCollections } from "../seasoning-collection";
import { createMockItem } from "./seasoning-collection.test-helpers";

test("filterByType は種類 ID でコレクションを絞り込む", () => {
  const items = [
    { ...createMockItem(1, "醤油"), typeId: 1 },
    { ...createMockItem(2, "味噌"), typeId: 2 },
    { ...createMockItem(3, "みりん"), typeId: 1 },
  ];
  const collection = SeasoningCollections.from(items);

  const filtered = SeasoningCollections.filterByType(collection, 1);

  expect(SeasoningCollections.count(filtered)).toBe(2);
  expect(SeasoningCollections.toArray(filtered)[0]?.name).toBe("醤油");
  expect(SeasoningCollections.toArray(filtered)[1]?.name).toBe("みりん");
});

test("searchByName は部分一致かつ大文字小文字を無視する", () => {
  const items = [
    createMockItem(1, "濃口醤油"),
    createMockItem(2, "薄口醤油"),
    createMockItem(3, "味噌"),
  ];
  const collection = SeasoningCollections.from(items);

  const filtered = SeasoningCollections.searchByName(collection, "醤油");
  const filteredCaseInsensitive = SeasoningCollections.searchByName(
    SeasoningCollections.from([createMockItem(4, "Soy Sauce")]),
    "soy"
  );

  expect(SeasoningCollections.count(filtered)).toBe(2);
  expect(SeasoningCollections.count(filteredCaseInsensitive)).toBe(1);
});

test("filterByExpiryDays は日数以下のアイテムのみを残す", () => {
  const items = [
    createMockItem(1, "醤油", 5),
    createMockItem(2, "味噌", 10),
    createMockItem(3, "みりん", undefined),
  ];
  const collection = SeasoningCollections.from(items);

  const filtered = SeasoningCollections.filterByExpiryDays(collection, 7);

  expect(SeasoningCollections.count(filtered)).toBe(1);
  expect(SeasoningCollections.toArray(filtered)[0]?.name).toBe("醤油");
});
