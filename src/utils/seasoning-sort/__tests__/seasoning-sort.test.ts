import { expect, test } from "vitest";

import { SeasoningSort, sortSeasoningsByExpiry } from "../seasoning-sort";
import type { SeasoningListItem } from "@/types/seasoning";

let nextId = 1;
const createItem = (
  overrides: Partial<SeasoningListItem> = {}
): SeasoningListItem => ({
  id: overrides.id ?? nextId++,
  name: overrides.name ?? "Seasoning",
  typeId: overrides.typeId ?? 1,
  expiryStatus: overrides.expiryStatus ?? "fresh",
  daysUntilExpiry: overrides.daysUntilExpiry,
  expiresAt: overrides.expiresAt,
  bestBeforeAt: overrides.bestBeforeAt,
  purchasedAt: overrides.purchasedAt,
});

test("sortSeasoningsByExpiry - デフォルト優先度で並び替える", () => {
  const items = [
    createItem({ id: 1, name: "Soy Sauce", expiryStatus: "fresh", daysUntilExpiry: 5 }),
    createItem({ id: 2, name: "Vinegar", expiryStatus: "expired", daysUntilExpiry: -3 }),
    createItem({ id: 3, name: "Curry Powder", expiryStatus: "unknown" }),
    createItem({ id: 4, name: "Chili Oil", expiryStatus: "expiring_soon", daysUntilExpiry: 2 }),
  ];

  const sorted = [...items].sort(sortSeasoningsByExpiry);

  expect(sorted.map((item) => item.expiryStatus)).toEqual([
    "expired",
    "expiring_soon",
    "fresh",
    "unknown",
  ]);
});

test("sortSeasoningsByExpiry - 同一ステータスでは期限が近い順に並ぶ", () => {
  const items = [
    createItem({ id: 1, expiryStatus: "fresh", daysUntilExpiry: 4 }),
    createItem({ id: 2, expiryStatus: "fresh", daysUntilExpiry: 1 }),
    createItem({ id: 3, expiryStatus: "fresh" }),
  ];

  const sorted = [...items].sort(sortSeasoningsByExpiry);

  expect(sorted.map((item) => item.id)).toEqual([2, 1, 3]);
});

test("SeasoningSort - カスタム優先度と非破壊ソートに対応する", () => {
  const items = [
    createItem({ id: 1, expiryStatus: "fresh" }),
    createItem({ id: 2, expiryStatus: "expired" }),
    createItem({ id: 3, expiryStatus: "unknown" }),
  ];

  const priority = {
    fresh: 0,
    unknown: 1,
    expiring_soon: 2,
    expired: 3,
  } as const;

  const comparator = SeasoningSort.createComparator({ priority });

  const sortedWithComparator = [...items].sort(comparator);
  const sortedByUtility = SeasoningSort.sortByExpiry(items, { priority });

  expect(sortedWithComparator.map((item) => item.expiryStatus)).toEqual([
    "fresh",
    "unknown",
    "expired",
  ]);
  expect(sortedByUtility).not.toBe(items);
  expect(sortedByUtility.map((item) => item.expiryStatus)).toEqual([
    "fresh",
    "unknown",
    "expired",
  ]);
});
