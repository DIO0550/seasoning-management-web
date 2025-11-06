/**
 * SeasoningCollections.applyQuery のテスト
 */

import { test, expect } from "vitest";
import { SeasoningCollections } from "../seasoning-collection";
import type { SeasoningListQuery } from "@/types/api/seasoning/list/types";
import { createMockItem } from "./seasoning-collection.test-helpers";

test("applyQuery はクエリ条件を順に適用して結果を返す", () => {
  const items = [
    { ...createMockItem(1, "濃口醤油", 10), typeId: 1 },
    { ...createMockItem(2, "薄口醤油", 5), typeId: 1 },
    { ...createMockItem(3, "味噌", 15), typeId: 2 },
    { ...createMockItem(4, "白醤油", 3), typeId: 1 },
  ];
  const query: SeasoningListQuery = {
    page: 1,
    pageSize: 10,
    typeId: 1,
    search: "醤油",
    sort: "expiryAsc",
  };

  const collection = SeasoningCollections.from(items);
  const result = SeasoningCollections.applyQuery(collection, query);
  const array = SeasoningCollections.toArray(result);

  expect(array).toHaveLength(3);
  expect(array[0]?.name).toBe("白醤油");
  expect(array[1]?.name).toBe("薄口醤油");
  expect(array[2]?.name).toBe("濃口醤油");
});
