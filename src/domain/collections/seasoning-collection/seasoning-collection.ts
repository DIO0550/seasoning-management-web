/**
 * @fileoverview 調味料コレクション - SeasoningListItem[] をファーストクラスコレクションとして扱う純粋関数セット
 */

import type { SeasoningListItem } from "@/types/seasoning";
import type { SortOrder } from "@/types/seasoning-sort";
import type { SeasoningListQuery } from "@/types/api/seasoning/list/types";

/** SeasoningListItem[] を表すコレクション型 */
export type SeasoningCollection = ReadonlyArray<SeasoningListItem>;

/** ページネーション結果 */
export interface PaginatedSeasonings {
  items: SeasoningCollection;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** サマリー情報 */
export interface SeasoningSummary {
  totalCount: number;
  expiringCount: number;
  expiredCount: number;
}

const clampCollection = (
  source: Iterable<SeasoningListItem>
): SeasoningCollection => Object.freeze([...source]) as SeasoningCollection;

/** 内部: 期限比較（null/undefined は最後） */
const compareByExpiry = (
  a: SeasoningListItem,
  b: SeasoningListItem,
  direction: "asc" | "desc"
): number => {
  const aDays = a.daysUntilExpiry;
  const bDays = b.daysUntilExpiry;
  if (aDays === undefined || aDays === null) return 1;
  if (bDays === undefined || bDays === null) return -1;
  const diff = aDays - bDays;
  return direction === "asc" ? diff : -diff;
};

const filterByType = (
  collection: SeasoningCollection,
  typeId: number
): SeasoningCollection =>
  clampCollection(collection.filter((item) => item.typeId === typeId));

const searchByName = (
  collection: SeasoningCollection,
  query: string
): SeasoningCollection => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return clampCollection(collection);
  return clampCollection(
    collection.filter((item) => item.name.toLowerCase().includes(normalized))
  );
};

const filterByExpiryDays = (
  collection: SeasoningCollection,
  maxDays: number
): SeasoningCollection =>
  clampCollection(
    collection.filter(
      (item) =>
        item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= maxDays
    )
  );

const sortBy = (
  collection: SeasoningCollection,
  order: SortOrder
): SeasoningCollection => {
  const sorted = [...collection].sort((a, b) => {
    switch (order) {
      case "expiryAsc":
        return compareByExpiry(a, b, "asc");
      case "expiryDesc":
        return compareByExpiry(a, b, "desc");
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  return clampCollection(sorted);
};

const paginate = (
  collection: SeasoningCollection,
  page: number,
  pageSize: number
): PaginatedSeasonings => {
  const totalItems = collection.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = collection.slice(startIndex, endIndex);

  return {
    items: clampCollection(paginatedItems),
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};

const calculateSummary = (
  collection: SeasoningCollection
): SeasoningSummary => {
  const expiringCount = collection.filter(
    (item) => item.expiryStatus === "expiring_soon"
  ).length;
  const expiredCount = collection.filter(
    (item) => item.expiryStatus === "expired"
  ).length;
  return {
    totalCount: collection.length,
    expiringCount,
    expiredCount,
  };
};

const count = (collection: SeasoningCollection): number => collection.length;

const isEmpty = (collection: SeasoningCollection): boolean =>
  collection.length === 0;

const toArray = (
  collection: SeasoningCollection
): SeasoningCollection => collection;

const applyQuery = (
  collection: SeasoningCollection,
  query: SeasoningListQuery
): SeasoningCollection => {
  let result = collection;

  if (query.typeId !== undefined) {
    result = filterByType(result, query.typeId);
  }

  if (query.search) {
    result = searchByName(result, query.search);
  }

  if (query.expiresWithinDays !== undefined) {
    result = filterByExpiryDays(result, query.expiresWithinDays);
  }

  if (query.sort) {
    result = sortBy(result, query.sort);
  }

  return result;
};

/**
 * SeasoningCollection に対する純粋操作関数群
 */
export const SeasoningCollections = Object.freeze({
  from: (items: Iterable<SeasoningListItem>): SeasoningCollection =>
    clampCollection(items),
  empty: (): SeasoningCollection => clampCollection([]),
  count,
  isEmpty,
  toArray,
  filterByType,
  searchByName,
  filterByExpiryDays,
  sortBy,
  paginate,
  calculateSummary,
  applyQuery,
});
