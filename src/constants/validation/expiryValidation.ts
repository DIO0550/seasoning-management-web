/**
 * 期限に関するバリデーション定数
 * 調味料の期限判定に使用される値を管理
 */

/**
 * 期限切れ間近と判定する日数（日）
 */
export const EXPIRY_WARNING_DAYS = 7;

/**
 * 1日あたりのミリ秒数
 */
export const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * 期限関連バリデーション定数をまとめたオブジェクト
 */
export const EXPIRY_VALIDATION_CONSTANTS = {
  EXPIRY_WARNING_DAYS,
  MILLISECONDS_PER_DAY,
} as const;
