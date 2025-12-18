/**
 * 画像系バリデーション定数
 * 画像サイズ制限とバイト換算に関する定数を管理
 */

/**
 * バイト換算用の基数（1KB = 1024バイト）
 */
export const BYTES_PER_KB = 1024;

/**
 * 画像サイズ制限（MB単位）
 */
export const IMAGE_MAX_SIZE_MB = 5;

/**
 * 画像サイズ制限（バイト単位）
 */
export const IMAGE_MAX_SIZE_BYTES =
  IMAGE_MAX_SIZE_MB * BYTES_PER_KB * BYTES_PER_KB;

/**
 * 画像バリデーション定数をまとめたオブジェクト
 */
export const IMAGE_VALIDATION_CONSTANTS = {
  BYTES_PER_KB,
  IMAGE_MAX_SIZE_MB,
  IMAGE_MAX_SIZE_BYTES,
} as const;

/**
 * 画像バリデーション定数の型定義
 */
export type ImageValidationConstants = typeof IMAGE_VALIDATION_CONSTANTS;
