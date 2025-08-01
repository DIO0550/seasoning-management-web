import { ErrorCode } from "./ErrorCode";
import { ErrorSeverity } from "./ErrorSeverity";

/**
 * データベース操作関連エラーの基底クラス
 */
export class DatabaseError extends Error {
  /**
   * エラーコード
   */
  public readonly code: ErrorCode;

  /**
   * エラーの重要度
   */
  public readonly severity: ErrorSeverity;

  /**
   * エラー発生時刻
   */
  public readonly timestamp: Date;

  /**
   * エラーのコンテキスト情報
   */
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    severity: ErrorSeverity,
    context?: Record<string, unknown>
  ) {
    super(message);

    this.name = "DatabaseError";
    this.code = code;
    this.severity = severity;
    this.timestamp = new Date();
    this.context = context;

    // スタックトレースの設定
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }

  /**
   * エラー情報をJSON形式でシリアライズ
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
    };
  }

  /**
   * エラー情報の文字列表現
   */
  toString(): string {
    const contextStr = this.context
      ? ` Context: ${JSON.stringify(this.context)}`
      : "";

    return `${this.name}: ${this.message} [Code: ${this.code}, Severity: ${
      this.severity
    }, Time: ${this.timestamp.toISOString()}]${contextStr}`;
  }
}
