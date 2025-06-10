/**
 * フォームバリデーション用の定数
 */
export const VALIDATION_CONSTANTS = {
  /** 調味料名の最大文字数 */
  NAME_MAX_LENGTH: 20,
  /** 画像ファイルの最大サイズ（バイト） */
  IMAGE_MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  /** 画像ファイルの最大サイズ（MB表示用） */
  IMAGE_MAX_SIZE_MB: 5,
  /** 許可される画像ファイル形式 */
  IMAGE_VALID_TYPES: ["image/jpeg", "image/png"] as const,
} as const;
