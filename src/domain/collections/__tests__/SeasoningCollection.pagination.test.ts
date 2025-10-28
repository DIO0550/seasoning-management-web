/**
 * SeasoningCollections のページネーションテスト
 */

import { test, expect } from "vitest";
import { SeasoningCollections } from "../SeasoningCollection";
import { createMockItem } from "./SeasoningCollection.test-helpers";

const createSequentialItems = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    createMockItem(index + 1, `調味料${index + 1}`)
  );

test("paginate は指定ページの件数・メタ情報を返す", () => {
  const items = createSequentialItems(25);
  const collection = SeasoningCollections.from(items);

  const page1 = SeasoningCollections.paginate(collection, 1, 10);

  expect(page1.items).toHaveLength(10);
  expect(page1.page).toBe(1);
  expect(page1.pageSize).toBe(10);
  expect(page1.totalItems).toBe(25);
  expect(page1.totalPages).toBe(3);
  expect(page1.hasNext).toBe(true);
  expect(page1.hasPrevious).toBe(false);
});

test("paginate は最終ページで hasNext=false を返す", () => {
  const items = createSequentialItems(25);
  const collection = SeasoningCollections.from(items);

  const page3 = SeasoningCollections.paginate(collection, 3, 10);

  expect(page3.items).toHaveLength(5);
  expect(page3.hasNext).toBe(false);
  expect(page3.hasPrevious).toBe(true);
});
