/**
 * @fileoverview ListSeasoningsUseCaseのDTO定義
 */

import type { ExpiryStatus } from "@/domain/entities/seasoning/seasoning";

/**
 * ソート順の型定義
 */
export type SortOrder = "expiryAsc" | "expiryDesc" | "nameAsc" | "nameDesc";

/**
 * 調味料一覧取得のInput DTO
 * Interface層から受け取るクエリパラメータ
 */
export interface ListSeasoningsInput {
  /** ページ番号 */
  page: number;
  /** ページサイズ */
  pageSize: number;
  /** 調味料種類IDでフィルタリング */
  typeId?: number;
  /** 指定日数以内に期限切れとなるアイテム */
  expiresWithinDays?: number;
  /** 調味料名の部分一致検索 */
  search?: string;
  /** ソートキー */
  sort?: SortOrder;
}

/**
 * ページネーションメタ情報
 */
export interface PaginationMeta {
  /** 現在のページ番号 */
  page: number;
  /** ページサイズ */
  pageSize: number;
  /** 総アイテム数 */
  totalItems: number;
  /** 総ページ数 */
  totalPages: number;
  /** 次のページがあるか */
  hasNext: boolean;
  /** 前のページがあるか */
  hasPrevious: boolean;
}

/**
 * サマリー情報
 */
export interface SeasoningSummary {
  /** 総数 */
  totalCount: number;
  /** 期限が近いアイテム数 */
  expiringCount: number;
  /** 期限切れアイテム数 */
  expiredCount: number;
}

/**
 * 一覧表示用の調味料アイテム
 */
export interface SeasoningListItemDto {
  id: number;
  name: string;
  typeId: number;
  imageId: number | null;
  bestBeforeAt: string | null;
  expiresAt: string | null;
  purchasedAt: string | null;
  daysUntilExpiry: number | null;
  expiryStatus: ExpiryStatus;
}

/**
 * 調味料一覧取得のOutput DTO
 * Interface層に返すレスポンス
 */
export interface ListSeasoningsOutput {
  /** 調味料一覧データ */
  data: SeasoningListItemDto[];
  /** ページネーションメタ */
  meta: PaginationMeta;
  /** サマリー情報 */
  summary: SeasoningSummary;
}
