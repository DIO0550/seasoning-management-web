/**
 * @fileoverview 調味料ドメインの共通型定義
 */

/**
 * 期限ステータスの型定義
 * OpenAPI仕様に基づく
 */
export type ExpiryStatus = "fresh" | "expiring_soon" | "expired" | "unknown";

/**
 * 調味料リスト項目の型定義
 * 一覧表示用のデータ構造
 */
export interface SeasoningListItem {
  id: number;
  name: string;
  typeId: number;
  expiresAt?: Date;
  bestBeforeAt?: Date;
  purchasedAt?: Date;
  daysUntilExpiry?: number;
  expiryStatus: ExpiryStatus;
}

/**
 * 調味料の種類を表す型
 */
export interface SeasoningType {
  /** 一意識別子 */
  id: string;
  /** 調味料の種類名 */
  name: string;
  /** 作成日時 */
  createdAt?: Date;
  /** 更新日時 */
  updatedAt?: Date;
}

/**
 * 調味料の種類追加時のフォームデータ
 */
export interface SeasoningTypeFormData {
  /** 調味料の種類名 */
  name: string;
}
