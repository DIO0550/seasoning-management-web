import { SEASONING_NAME_MAX_LENGTH } from "./validation/nameValidation";
import {
  IMAGE_MAX_SIZE_MB,
  IMAGE_MAX_SIZE_BYTES,
} from "./validation/imageValidation";

/**
 * フォームバリデーション用の定数
 */
export const VALIDATION_CONSTANTS = {
  /** 調味料名の最大文字数 */
  NAME_MAX_LENGTH: SEASONING_NAME_MAX_LENGTH,
  /** 画像ファイルの最大サイズ（バイト） */
  IMAGE_MAX_SIZE_BYTES: IMAGE_MAX_SIZE_BYTES,
  /** 画像ファイルの最大サイズ（MB表示用） */
  IMAGE_MAX_SIZE_MB: IMAGE_MAX_SIZE_MB,
  /** 許可される画像ファイル形式 */
  IMAGE_VALID_TYPES: ["image/jpeg", "image/png"] as const,
} as const;

/**
 * バリデーションエラーメッセージ（ネストされた構造）
 */
export const VALIDATION_ERROR_MESSAGES = {
  IMAGE: {
    INVALID_TYPE: "JPEG、PNG 形式のファイルを選択してください",
    SIZE_EXCEEDED: (maxSizeMB: number): string =>
      `ファイルサイズは ${maxSizeMB}MB 以下にしてください`,
  },
  NAME: {
    REQUIRED: "調味料名は必須です",
    INVALID_FORMAT: "調味料名は半角英数字で入力してください",
    LENGTH_EXCEEDED: (maxLength: number): string =>
      `調味料名は ${maxLength} 文字以内で入力してください`,
  },
  SEASONING: {
    SUBMIT_ERROR: "調味料の登録に失敗しました。入力内容を確認してください",
  },
} as const;
