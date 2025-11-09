/**
 * @fileoverview SeasoningListItem 用のコンパニオンオブジェクト
 */

import type { ExpiryStatus, SeasoningListItem } from "@/types/seasoning";

export type SeasoningListItemSortConfig = {
  /** ステータスごとの優先度。数値が小さいほど優先度が高い。 */
  priority?: Partial<Record<ExpiryStatus, number>>;
};

type ExpiryStatusPriority = Record<ExpiryStatus, number>;

const DEFAULT_STATUS_PRIORITY: Readonly<ExpiryStatusPriority> = Object.freeze({
  expired: 0,
  expiring_soon: 1,
  fresh: 2,
  unknown: 3,
});

const resolvePriority = (
  overrides?: SeasoningListItemSortConfig["priority"]
): ExpiryStatusPriority => ({
  ...DEFAULT_STATUS_PRIORITY,
  ...overrides,
});

const compareStatus = (
  aStatus: ExpiryStatus,
  bStatus: ExpiryStatus,
  priority: ExpiryStatusPriority
): number => priority[aStatus] - priority[bStatus];

const compareWithinSameStatus = (
  a: SeasoningListItem,
  b: SeasoningListItem
): number => {
  if (
    a.daysUntilExpiry !== undefined &&
    b.daysUntilExpiry !== undefined
  ) {
    return a.daysUntilExpiry - b.daysUntilExpiry;
  }

  if (a.daysUntilExpiry === undefined && b.daysUntilExpiry !== undefined) {
    return 1;
  }

  if (a.daysUntilExpiry !== undefined && b.daysUntilExpiry === undefined) {
    return -1;
  }

  return 0;
};

const compareSeasonings = (
  a: SeasoningListItem,
  b: SeasoningListItem,
  config: SeasoningListItemSortConfig = {}
): number => {
  const priority = resolvePriority(config.priority);
  const statusResult = compareStatus(
    a.expiryStatus,
    b.expiryStatus,
    priority
  );

  if (statusResult !== 0) {
    return statusResult;
  }

  return compareWithinSameStatus(a, b);
};

/**
 * SeasoningListItem のコンパニオンオブジェクト
 */
export const SeasoningListItemOrder = {
  /** デフォルト優先度 */
  priority: DEFAULT_STATUS_PRIORITY,

  /**
   * 期限ステータスに基づく比較関数
   */
  compareByExpiry(
    a: SeasoningListItem,
    b: SeasoningListItem,
    config: SeasoningListItemSortConfig = {}
  ): number {
    return compareSeasonings(a, b, config);
  },

  /**
   * 設定済みコンパレータを生成
   */
  createComparator(config: SeasoningListItemSortConfig = {}) {
    return (left: SeasoningListItem, right: SeasoningListItem): number =>
      SeasoningListItemOrder.compareByExpiry(left, right, config);
  },
} as const;
