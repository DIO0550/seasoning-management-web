/**
 * エラーの重要度レベル
 */
export const ErrorSeverity = {
  /**
   * 致命的: システム停止、緊急対応が必要
   */
  CRITICAL: "CRITICAL",

  /**
   * 高: 重要な機能に影響、速やかな対応が必要
   */
  HIGH: "HIGH",

  /**
   * 中: 一部機能に影響、通常の対応で問題なし
   */
  MEDIUM: "MEDIUM",

  /**
   * 低: 影響は軽微、ログ記録レベル
   */
  LOW: "LOW",

  /**
   * 情報: 通常の動作、デバッグ情報レベル
   */
  INFO: "INFO",
} as const;

export type ErrorSeverity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];
