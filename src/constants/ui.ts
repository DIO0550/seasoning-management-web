/**
 * UI関連の定数定義
 *
 * ユーザーインターフェースで使用される定数の統一管理を目的とする。
 * ディレイ時間やアニメーション関連の値を一元管理し、
 * マジックナンバーの排除と設定の統一を図る。
 */

/**
 * Storybookでの短いディレイ時間（500ms）
 * 軽微な操作やレスポンスの表現に使用
 */
export const STORYBOOK_DELAY_SHORT = 500 as const;

/**
 * Storybookでの標準的なディレイ時間（1000ms）
 * 一般的な非同期処理のシミュレーションに使用
 */
export const STORYBOOK_DELAY_MEDIUM = 1000 as const;

/**
 * Storybookでの長めのディレイ時間（1500ms）
 * やや重い処理のシミュレーションに使用
 */
export const STORYBOOK_DELAY_LONG = 1500 as const;

/**
 * Storybookでの非常に長いディレイ時間（2000ms）
 * 重い処理のシミュレーションに使用
 */
export const STORYBOOK_DELAY_VERY_LONG = 2000 as const;

/**
 * Storybookでの極めて長いディレイ時間（5000ms）
 * 非常に重い処理やタイムアウトのシミュレーションに使用
 */
export const STORYBOOK_DELAY_EXTRA_LONG = 5000 as const;

/**
 * テスト用の非同期処理ディレイ（0ms）
 * Promiseの解決を待つためのディレイ、実際の待機は不要
 */
export const TEST_ASYNC_DELAY = 0 as const;

/**
 * ディレイ時間の型定義
 * ミリ秒単位での時間値
 */
export type DelayTime = number;

/**
 * ディレイレベルの定義
 * 用途に応じてディレイ時間を選択するための列挙
 */
export const DELAY_LEVELS = {
  /** 最短ディレイ（テスト用） */
  NONE: TEST_ASYNC_DELAY,
  /** 短いディレイ */
  SHORT: STORYBOOK_DELAY_SHORT,
  /** 標準ディレイ */
  MEDIUM: STORYBOOK_DELAY_MEDIUM,
  /** 長いディレイ */
  LONG: STORYBOOK_DELAY_LONG,
  /** 非常に長いディレイ */
  VERY_LONG: STORYBOOK_DELAY_VERY_LONG,
  /** 極めて長いディレイ */
  EXTRA_LONG: STORYBOOK_DELAY_EXTRA_LONG,
} as const;
