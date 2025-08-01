import { LogLevel } from "../formatters/LogLevel";

/**
 * ログエントリのインターフェース
 */
export interface ILogEntry {
  /**
   * ログレベル
   */
  level: LogLevel;

  /**
   * ログメッセージ
   */
  message: string;

  /**
   * タイムスタンプ
   */
  timestamp: Date;

  /**
   * ログソース（どのクラス/メソッドからのログか）
   */
  source?: string;

  /**
   * 追加のメタデータ
   */
  metadata?: Record<string, unknown>;

  /**
   * エラー情報（エラーレベルの場合）
   */
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };

  /**
   * 実行コンテキスト情報
   */
  context?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    operation?: string;
  };
}
