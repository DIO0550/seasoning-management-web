/**
 * SeasoningCollections の基本操作テスト
 * テスト構造: フラット（describe なし）
 */

import { test, expect } from "vitest";
import { SeasoningCollections } from "../SeasoningCollection";
import { createMockItem } from "./SeasoningCollection.test-helpers";

test("SeasoningCollections.from は配列を取り込み count/isEmpty を提供する", () => {
  const items = [createMockItem(1, "醤油")];
  const collection = SeasoningCollections.from(items);

  expect(SeasoningCollections.count(collection)).toBe(1);
  expect(SeasoningCollections.isEmpty(collection)).toBe(false);
});

test("SeasoningCollections.empty は空コレクションを返す", () => {
  const collection = SeasoningCollections.empty();

  expect(SeasoningCollections.count(collection)).toBe(0);
  expect(SeasoningCollections.isEmpty(collection)).toBe(true);
});

test("SeasoningCollections.toArray は読み取り専用配列を返す", () => {
  const items = [createMockItem(1, "醤油")];
  const collection = SeasoningCollections.from(items);

  const array = SeasoningCollections.toArray(collection);

  expect(array).toHaveLength(1);
  expect(array[0]?.name).toBe("醤油");
});
