import type { SeasoningListItem } from "@/types/seasoning";

export const createMockItem = (
  id: number,
  name: string,
  daysUntilExpiry?: number,
  expiryStatus: SeasoningListItem["expiryStatus"] = "fresh"
): SeasoningListItem => ({
  id,
  name,
  typeId: 1,
  daysUntilExpiry,
  expiryStatus,
});
