/**
 * SeasoningCollections のソート操作テスト
 */

import { test, expect } from "vitest";
import { SeasoningCollections } from "../seasoning-collection";
import { createMockItem } from "./seasoning-collection.test-helpers";

test("sortBy('expiryAsc') は期限昇順で並べ替える", () => {
  const items = [
    createMockItem(1, "醤油", 10),
    createMockItem(2, "味噌", 5),
    createMockItem(3, "みりん", 15),
  ];
  const collection = SeasoningCollections.from(items);

  const sorted = SeasoningCollections.sortBy(collection, "expiryAsc");
  const array = SeasoningCollections.toArray(sorted);

  expect(array[0]?.daysUntilExpiry).toBe(5);
  expect(array[1]?.daysUntilExpiry).toBe(10);
  expect(array[2]?.daysUntilExpiry).toBe(15);
});

test("sortBy('expiryDesc') は期限降順で並べ替える", () => {
  const items = [
    createMockItem(1, "醤油", 10),
    createMockItem(2, "味噌", 5),
    createMockItem(3, "みりん", 15),
  ];
  const collection = SeasoningCollections.from(items);

  const sorted = SeasoningCollections.sortBy(collection, "expiryDesc");
  const array = SeasoningCollections.toArray(sorted);

  expect(array[0]?.daysUntilExpiry).toBe(15);
  expect(array[1]?.daysUntilExpiry).toBe(10);
  expect(array[2]?.daysUntilExpiry).toBe(5);
});

test("sortBy('nameAsc') は名前昇順で並べ替える", () => {
  const items = [
    createMockItem(1, "みりん"),
    createMockItem(2, "醤油"),
    createMockItem(3, "味噌"),
  ];
  const collection = SeasoningCollections.from(items);

  const sorted = SeasoningCollections.sortBy(collection, "nameAsc");
  const array = SeasoningCollections.toArray(sorted);

  expect(array[0]?.name).toBe("みりん");
  expect(array[1]?.name).toBe("醤油");
  expect(array[2]?.name).toBe("味噌");
});

test("sortBy('nameDesc') は名前降順で並べ替える", () => {
  const items = [
    createMockItem(1, "みりん"),
    createMockItem(2, "醤油"),
    createMockItem(3, "味噌"),
  ];
  const collection = SeasoningCollections.from(items);

  const sorted = SeasoningCollections.sortBy(collection, "nameDesc");
  const array = SeasoningCollections.toArray(sorted);

  expect(array[0]?.name).toBe("味噌");
  expect(array[1]?.name).toBe("醤油");
  expect(array[2]?.name).toBe("みりん");
});

test("expiry ソートでは日数不明の要素が常に末尾になる", () => {
  const items = [
    createMockItem(1, "醤油", 10),
    createMockItem(2, "味噌", undefined),
    createMockItem(3, "みりん", 5),
  ];
  const collection = SeasoningCollections.from(items);

  const sorted = SeasoningCollections.sortBy(collection, "expiryAsc");
  const array = SeasoningCollections.toArray(sorted);

  expect(array[2]?.name).toBe("味噌");
});
