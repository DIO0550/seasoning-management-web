/**
 * SeasoningCollections のメソッド連携テスト
 */

import { test, expect } from "vitest";
import { SeasoningCollections } from "../SeasoningCollection";
import { createMockItem } from "./SeasoningCollection.test-helpers";

test("SeasoningCollections の関数を組み合わせてチェーンできる", () => {
  const items = [
    { ...createMockItem(1, "濃口醤油", 10), typeId: 1 },
    { ...createMockItem(2, "薄口醤油", 5), typeId: 1 },
    { ...createMockItem(3, "味噌", 15), typeId: 2 },
    { ...createMockItem(4, "白醤油", 3), typeId: 1 },
  ];
  const collection = SeasoningCollections.from(items);

  const filtered = SeasoningCollections.filterByType(collection, 1);
  const searched = SeasoningCollections.searchByName(filtered, "醤油");
  const sorted = SeasoningCollections.sortBy(searched, "expiryAsc");
  const paginated = SeasoningCollections.paginate(sorted, 1, 10);

  expect(paginated.items).toHaveLength(3);
  expect(paginated.items[0]?.name).toBe("白醤油");
  expect(paginated.items[1]?.name).toBe("薄口醤油");
  expect(paginated.items[2]?.name).toBe("濃口醤油");
});

test("SeasoningCollections は不変なため元のコレクションを破壊しない", () => {
  const items = [createMockItem(1, "醤油", 10)];
  const collection = SeasoningCollections.from(items);

  SeasoningCollections.sortBy(collection, "nameDesc");
  SeasoningCollections.filterByType(collection, 2);

  expect(SeasoningCollections.count(collection)).toBe(1);
  expect(SeasoningCollections.toArray(collection)[0]?.name).toBe("醤油");
});
