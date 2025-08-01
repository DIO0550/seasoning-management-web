import { DatabaseError } from "../base/DatabaseError";
import { ErrorCode } from "../base/ErrorCode";
import { ErrorSeverity } from "../base/ErrorSeverity";

/**
 * 競合エラークラス
 * データの重複や競合状態が発生した場合に使用
 */
export class ConflictError extends DatabaseError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ) {
    super(message, ErrorCode.DUPLICATE_KEY, severity, context);
    this.name = "ConflictError";
  }
}
