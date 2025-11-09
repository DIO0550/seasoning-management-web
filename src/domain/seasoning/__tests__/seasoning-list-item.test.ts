import { expect, test } from "vitest";

import { SeasoningListItemOrder } from "../seasoning-list-item";
import type { SeasoningListItem } from "@/types/seasoning";

const createItem = (
  overrides: Partial<SeasoningListItem>
): SeasoningListItem => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? "Seasoning",
  typeId: overrides.typeId ?? 1,
  expiryStatus: overrides.expiryStatus ?? "fresh",
  daysUntilExpiry: overrides.daysUntilExpiry,
  expiresAt: overrides.expiresAt,
  bestBeforeAt: overrides.bestBeforeAt,
  purchasedAt: overrides.purchasedAt,
});

test("SeasoningListItemOrder - デフォルト優先度で expired が先頭になる", () => {
  const expired = createItem({ id: 1, expiryStatus: "expired" });
  const fresh = createItem({ id: 2, expiryStatus: "fresh" });

  expect(SeasoningListItemOrder.compareByExpiry(expired, fresh)).toBeLessThan(0);
});

test("SeasoningListItemOrder - createComparator でカスタム優先度を適用できる", () => {
  const comparator = SeasoningListItemOrder.createComparator({
    priority: {
      fresh: 0,
      expiring_soon: 1,
      expired: 2,
      unknown: 3,
    },
  });

  const expired = createItem({ id: 1, expiryStatus: "expired" });
  const fresh = createItem({ id: 2, expiryStatus: "fresh" });

  expect(comparator(fresh, expired)).toBeLessThan(0);
});
