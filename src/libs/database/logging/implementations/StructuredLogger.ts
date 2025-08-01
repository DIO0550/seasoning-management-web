import { ILogger } from "../interfaces/ILogger";
import { ILogEntry } from "../interfaces/ILogEntry";
import { LogLevel, LogLevelPriority } from "../formatters/LogLevel";

/**
 * 構造化ログ出力を行うロガー実装
 */
export class StructuredLogger implements ILogger {
  public readonly minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  debug(
    message: string,
    metadata?: Record<string, unknown>,
    source?: string
  ): void {
    if (this.isLevelEnabled(LogLevel.DEBUG)) {
      this.log({
        level: LogLevel.DEBUG,
        message,
        timestamp: new Date(),
        source,
        metadata,
      });
    }
  }

  info(
    message: string,
    metadata?: Record<string, unknown>,
    source?: string
  ): void {
    if (this.isLevelEnabled(LogLevel.INFO)) {
      this.log({
        level: LogLevel.INFO,
        message,
        timestamp: new Date(),
        source,
        metadata,
      });
    }
  }

  warn(
    message: string,
    metadata?: Record<string, unknown>,
    source?: string
  ): void {
    if (this.isLevelEnabled(LogLevel.WARN)) {
      this.log({
        level: LogLevel.WARN,
        message,
        timestamp: new Date(),
        source,
        metadata,
      });
    }
  }

  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    source?: string
  ): void {
    if (this.isLevelEnabled(LogLevel.ERROR)) {
      this.log({
        level: LogLevel.ERROR,
        message,
        timestamp: new Date(),
        source,
        metadata,
        error: error ? this.serializeError(error) : undefined,
      });
    }
  }

  fatal(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    source?: string
  ): void {
    if (this.isLevelEnabled(LogLevel.FATAL)) {
      this.log({
        level: LogLevel.FATAL,
        message,
        timestamp: new Date(),
        source,
        metadata,
        error: error ? this.serializeError(error) : undefined,
      });
    }
  }

  log(entry: ILogEntry): void {
    if (this.isLevelEnabled(entry.level)) {
      const logOutput = {
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp.toISOString(),
        source: entry.source,
        metadata: entry.metadata,
        error: entry.error,
        context: entry.context,
      };

      // JSON形式で構造化ログとして出力
      console.log(JSON.stringify(logOutput, null, 0));
    }
  }

  isLevelEnabled(level: LogLevel): boolean {
    return LogLevelPriority[level] >= LogLevelPriority[this.minLevel];
  }

  /**
   * Errorオブジェクトをログ用にシリアライズ
   */
  private serializeError(error: Error): {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  } {
    const errorWithCode = error as Error & { code?: string };
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: errorWithCode.code || undefined,
    };
  }
}
