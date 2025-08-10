import {
  NAME_VALIDATION_CONSTANTS,
  SEASONING_NAME_MAX_LENGTH,
} from "./validation/nameValidation";
import { DESCRIPTION_VALIDATION_CONSTANTS } from "./validation/descriptionValidation";
import {
  IMAGE_VALIDATION_CONSTANTS,
  IMAGE_MAX_SIZE_MB,
  IMAGE_MAX_SIZE_BYTES,
} from "./validation/imageValidation";
import { EXPIRY_VALIDATION_CONSTANTS } from "./validation/expiryValidation";

/**
 * 統合されたバリデーション定数
 * 各カテゴリの定数を一箇所にまとめて管理
 */
export const VALIDATION_CONSTANTS = {
  /** 名前系バリデーション定数 */
  NAME: NAME_VALIDATION_CONSTANTS,
  /** 説明系バリデーション定数 */
  DESCRIPTION: DESCRIPTION_VALIDATION_CONSTANTS,
  /** 画像系バリデーション定数 */
  IMAGE: {
    ...IMAGE_VALIDATION_CONSTANTS,
    /** 許可される画像ファイル形式 */
    VALID_TYPES: ["image/jpeg", "image/png"] as const,
  },
  /** 期限系バリデーション定数 */
  EXPIRY: EXPIRY_VALIDATION_CONSTANTS,

  // 後方互換性のための定数（将来的に削除予定）
  /** @deprecated VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH を使用してください */
  NAME_MAX_LENGTH: SEASONING_NAME_MAX_LENGTH,
  /** @deprecated VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_BYTES を使用してください */
  IMAGE_MAX_SIZE_BYTES: IMAGE_MAX_SIZE_BYTES,
  /** @deprecated VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_MB を使用してください */
  IMAGE_MAX_SIZE_MB: IMAGE_MAX_SIZE_MB,
  /** @deprecated VALIDATION_CONSTANTS.IMAGE.VALID_TYPES を使用してください */
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
