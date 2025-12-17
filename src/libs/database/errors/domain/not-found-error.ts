import { DatabaseError } from "../base/DatabaseError";
import { ErrorCode } from "../base/ErrorCode";
import { ErrorSeverity } from "../base/ErrorSeverity";

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
    this.name = "NotFoundError";
  }
}
