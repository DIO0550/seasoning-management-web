import { DatabaseError } from "../base/database-error";
import { ErrorCode } from "../base/error-code";
import { ErrorSeverity } from "../base/error-severity";

/**
 * バリデーションエラークラス
 * データの検証で問題が発生した場合に使用
 */
export class ValidationError extends DatabaseError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ) {
    super(message, ErrorCode.VALIDATION_ERROR, severity, context);
    this.name = "validation-error";
  }
}
