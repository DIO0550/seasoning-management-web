/**
 * @fileoverview 調味料の期限ステータス計算
 * コンパニオンオブジェクトパターンで実装
 */

import type { ExpiryStatus } from "@/types/seasoning";

// 型を re-export（後方互換性のため）
export type { ExpiryStatus } from "@/types/seasoning";

/**
 * 期限ステータス計算の設定
 */
type ExpiryStatusConfig = {
  /** 期限切れ間近とみなす日数 */
  expiringSoonThreshold: number;
};

/**
 * デフォルト設定
 */
const DEFAULT_CONFIG: ExpiryStatusConfig = {
  expiringSoonThreshold: 7,
} as const;

/**
 * 期限日までの日数を計算する
 * ExpiryStatus とは独立したユーティリティ関数
 */
export const calculateDaysUntilExpiry = (
  expiryDate: Date | null,
  baseDate: Date = new Date()
): number | null => {
  if (expiryDate === null) {
    return null;
  }

  // 時刻をリセットして日付のみで比較
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);

  // ミリ秒の差を日数に変換
  const diffTime = expiry.getTime() - base.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * ExpiryStatus のコンパニオンオブジェクト
 * ExpiryStatus 型の値を作成・操作する機能を提供
 *
 * @example
 * ```ts
 * // 日数からステータスを作成
 * ExpiryStatusUtils.fromDays(10); // "fresh"
 * ExpiryStatusUtils.fromDays(5);  // "expiring_soon"
 * ExpiryStatusUtils.fromDays(-1); // "expired"
 *
 * // 期限日から直接ステータスを作成
 * const status = ExpiryStatusUtils.fromDate(new Date("2025-10-25"));
 * ```
 */
export const ExpiryStatusUtils = {
  /**
   * 期限日までの日数からステータスを判定する
   */
  fromDays: (
    daysUntilExpiry: number | null,
    config: Partial<ExpiryStatusConfig> = {}
  ): ExpiryStatus => {
    const { expiringSoonThreshold } = { ...DEFAULT_CONFIG, ...config };

    if (daysUntilExpiry === null) {
      return "unknown";
    }

    if (daysUntilExpiry < 0) {
      return "expired";
    }

    if (daysUntilExpiry === 0) {
      return "expired";
    }

    if (daysUntilExpiry <= expiringSoonThreshold) {
      return "expiring_soon";
    }

    return "fresh";
  },

  /**
   * 期限日から直接ステータスを判定する
   */
  fromDate: (
    expiryDate: Date | null,
    baseDate: Date = new Date(),
    config: Partial<ExpiryStatusConfig> = {}
  ): ExpiryStatus => {
    const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate, baseDate);
    return ExpiryStatusUtils.fromDays(daysUntilExpiry, config);
  },
};
