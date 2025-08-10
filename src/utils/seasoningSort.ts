/**
 * @fileoverview 調味料リスト並び替えユーティリティ
 * 期限ステータスに基づく並び替えロジックを提供
 */

import type { SeasoningListItem } from "@/features/seasoning/usecases/GetSeasoningListUseCase";

/**
 * 調味料リストを期限ステータスに基づいて並び替える
 * - 期限切れ → 期限が近い → 新鮮 → 期限不明の順
 * - 同じステータス内では期限が近い順
 */
export function sortSeasoningsByExpiry(
  a: SeasoningListItem,
  b: SeasoningListItem
): number {
  // 期限切れのものを最初に
  if (a.expiryStatus === "expired" && b.expiryStatus !== "expired") return -1;
  if (a.expiryStatus !== "expired" && b.expiryStatus === "expired") return 1;

  // 期限が近いものを次に
  if (a.expiryStatus === "expiring_soon" && b.expiryStatus === "fresh")
    return -1;
  if (a.expiryStatus === "fresh" && b.expiryStatus === "expiring_soon")
    return 1;

  // 同じステータス内では期限が近い順
  if (a.daysUntilExpiry !== undefined && b.daysUntilExpiry !== undefined) {
    return a.daysUntilExpiry - b.daysUntilExpiry;
  }

  // 期限不明のものは最後
  if (a.daysUntilExpiry === undefined && b.daysUntilExpiry !== undefined)
    return 1;
  if (a.daysUntilExpiry !== undefined && b.daysUntilExpiry === undefined)
    return -1;

  return 0;
}
