/**
 * 名前系バリデーション定数
 * 各種名前フィールドの文字数制限を管理
 */

/**
 * 調味料名の最大文字数制限
 */
export const SEASONING_NAME_MAX_LENGTH = 100;

/**
 * テンプレート名の最大文字数制限
 */
export const TEMPLATE_NAME_MAX_LENGTH = 20;

/**
 * 調味料種類名の最大文字数制限
 */
export const SEASONING_TYPE_NAME_MAX_LENGTH = 50;

/**
 * 名前バリデーション定数をまとめたオブジェクト
 */
export const NAME_VALIDATION_CONSTANTS = {
  SEASONING_NAME_MAX_LENGTH,
  TEMPLATE_NAME_MAX_LENGTH,
  SEASONING_TYPE_NAME_MAX_LENGTH,
} as const;

/**
 * 名前バリデーション定数の型定義
 */
export type NameValidationConstants = typeof NAME_VALIDATION_CONSTANTS;
