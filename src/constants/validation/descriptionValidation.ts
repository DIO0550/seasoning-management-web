/**
 * 説明系バリデーション定数
 * 各種説明フィールドの文字数制限を管理
 */

/**
 * テンプレート説明の最大文字数制限
 */
export const TEMPLATE_DESCRIPTION_MAX_LENGTH = 200;

/**
 * 説明バリデーション定数をまとめたオブジェクト
 */
export const DESCRIPTION_VALIDATION_CONSTANTS = {
  TEMPLATE_DESCRIPTION_MAX_LENGTH,
} as const;

/**
 * 説明バリデーション定数の型定義
 */
export type DescriptionValidationConstants =
  typeof DESCRIPTION_VALIDATION_CONSTANTS;
