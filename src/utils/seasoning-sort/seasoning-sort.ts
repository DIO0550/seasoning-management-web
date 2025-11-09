/**
 * @fileoverview 調味料の並び替えユーティリティ
 */

import type { SeasoningListItem } from "@/types/seasoning";
import {
  SeasoningListItemOrder,
  type SeasoningListItemSortConfig,
} from "@/domain/seasoning/seasoning-list-item";

export type { SeasoningListItemSortConfig };

/**
 * SeasoningSort のコンパニオンオブジェクト
 */
export const SeasoningSort = {
  /** デフォルトの優先度設定 */
  priority: SeasoningListItemOrder.priority,

  /**
   * 期限ステータスに基づく比較関数
   */
  compareByExpiry(
    a: SeasoningListItem,
    b: SeasoningListItem,
    config: SeasoningListItemSortConfig = {}
  ): number {
    return SeasoningListItemOrder.compareByExpiry(a, b, config);
  },

  /**
   * 設定済みの比較関数を生成
   */
  createComparator(config: SeasoningListItemSortConfig = {}) {
    return (left: SeasoningListItem, right: SeasoningListItem): number =>
      SeasoningSort.compareByExpiry(left, right, config);
  },

  /**
   * 非破壊で並び替えた新しい配列を返す
   */
  sortByExpiry(
    list: SeasoningListItem[],
    config: SeasoningListItemSortConfig = {}
  ): SeasoningListItem[] {
    return [...list].sort(SeasoningSort.createComparator(config));
  },
} as const;

/**
 * 調味料リストを期限ステータスに基づいて並び替える
 * - 期限切れ → 期限が近い → 新鮮 → 期限不明の順
 * - 同じステータス内では期限が近い順
 */
export function sortSeasoningsByExpiry(
  a: SeasoningListItem,
  b: SeasoningListItem
): number {
  return SeasoningListItemOrder.compareByExpiry(a, b);
}
