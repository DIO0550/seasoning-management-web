import { LogLevel } from "../formatters/LogLevel";
import { ILogEntry } from "./ILogEntry";

/**
 * ロガーのインターフェース
 */
export interface ILogger {
  /**
   * 現在の最小ログレベル
   */
  readonly minLevel: LogLevel;

  /**
   * デバッグログを出力
   */
  debug(
    message: string,
    metadata?: Record<string, unknown>,
    source?: string
  ): void;

  /**
   * 情報ログを出力
   */
  info(
    message: string,
    metadata?: Record<string, unknown>,
    source?: string
  ): void;

  /**
   * 警告ログを出力
   */
  warn(
    message: string,
    metadata?: Record<string, unknown>,
    source?: string
  ): void;

  /**
   * エラーログを出力
   */
  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    source?: string
  ): void;

  /**
   * 致命的エラーログを出力
   */
  fatal(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    source?: string
  ): void;

  /**
   * ログエントリを直接出力
   */
  log(entry: ILogEntry): void;

  /**
   * 指定されたレベルのログが出力対象かチェック
   */
  isLevelEnabled(level: LogLevel): boolean;
}
