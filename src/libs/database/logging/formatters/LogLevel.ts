/**
 * ログレベル定義
 */
export const LogLevel = {
  /**
   * デバッグ情報: 開発時のデバッグ用途
   */
  DEBUG: "DEBUG",

  /**
   * 情報: 通常の動作ログ
   */
  INFO: "INFO",

  /**
   * 警告: 問題の可能性があるが動作に支障なし
   */
  WARN: "WARN",

  /**
   * エラー: エラー発生、機能に影響あり
   */
  ERROR: "ERROR",

  /**
   * 致命的: システム停止レベルのエラー
   */
  FATAL: "FATAL",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

/**
 * ログレベルの優先度（数値が大きいほど重要）
 */
export const LogLevelPriority: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4,
};
