/**
 * @fileoverview 期限計算ユーティリティ
 * 調味料の期限管理に関する計算処理を提供
 */

import { VALIDATION_CONSTANTS } from "@/constants/validation";

/**
 * 指定した日付から現在日時までの日数を計算する
 * @param expiryDate 期限日
 * @param currentDate 現在日時（デフォルト: new Date()）
 * @returns 期限までの日数（負の値は期限切れ）
 */
export function calculateDaysUntilExpiry(
  expiryDate: Date,
  currentDate: Date = new Date()
): number {
  const timeDiff = expiryDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / VALIDATION_CONSTANTS.EXPIRY.MILLISECONDS_PER_DAY);
}

/**
 * 期限までの日数から期限ステータスを判定する
 * @param daysUntilExpiry 期限までの日数
 * @returns 期限ステータス
 */
export function determineExpiryStatus(
  daysUntilExpiry: number
): "fresh" | "expiring_soon" | "expired" {
  if (daysUntilExpiry < 0) {
    return "expired";
  } else if (
    daysUntilExpiry <= VALIDATION_CONSTANTS.EXPIRY.EXPIRY_WARNING_DAYS
  ) {
    return "expiring_soon";
  } else {
    return "fresh";
  }
}

/**
 * 期限日から期限ステータスを直接判定する
 * @param expiryDate 期限日（undefinedの場合は"unknown"を返す）
 * @param currentDate 現在日時（デフォルト: new Date()）
 * @returns 期限ステータス
 */
export function calculateExpiryStatus(
  expiryDate: Date | null | undefined,
  currentDate: Date = new Date()
): {
  daysUntilExpiry?: number;
  status: "fresh" | "expiring_soon" | "expired" | "unknown";
} {
  if (!expiryDate) {
    return { status: "unknown" };
  }

  const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate, currentDate);
  const status = determineExpiryStatus(daysUntilExpiry);

  return { daysUntilExpiry, status };
}
