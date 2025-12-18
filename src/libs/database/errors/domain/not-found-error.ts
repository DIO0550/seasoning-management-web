import { DatabaseError } from "../base/database-error";
import { ErrorCode } from "../base/error-code";
import { ErrorSeverity } from "../base/error-severity";

/**
 * 未発見エラークラス
 * 指定されたリソースが見つからない場合に使用
 */
export class NotFoundError extends DatabaseError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
    severity: ErrorSeverity = ErrorSeverity.LOW
  ) {
    super(message, ErrorCode.NOT_FOUND, severity, context);
    this.name = "not-found-error";
  }
}
