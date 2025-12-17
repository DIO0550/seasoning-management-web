import { DatabaseError } from "../base/database-error";
import { ErrorCode } from "../base/error-code";
import { ErrorSeverity } from "../base/error-severity";
import { ValidationError } from "../domain/validation-error";
import { ConflictError } from "../domain/conflict-error";
import { ConnectionError } from "../domain/connection-error";
import { NotFoundError } from "../domain/not-found-error";
import { MySQLError, ErrorContext } from "./error-context";

/**
 * MySQLエラーをドメイン固有エラーにマッピングするクラス
 */
export class MySQLErrorMapper {
  /**
   * MySQLエラーを適切なドメインエラーにマップ
   */
  static mapError(
    error: Error,
    context?: Partial<ErrorContext>
  ): DatabaseError {
    const mysqlError = error as MySQLError;
    const errorContext = MySQLErrorMapper.buildErrorContext(
      mysqlError,
      context
    );

    // MySQL固有エラーコードによるマッピング
    if (mysqlError.code) {
      return MySQLErrorMapper.mapByErrorCode(mysqlError, errorContext);
    }

    // MySQL errno によるマッピング
    if (mysqlError.errno) {
      return MySQLErrorMapper.mapByErrno(mysqlError, errorContext);
    }

    // その他は汎用エラーとして処理
    return new DatabaseError(
      error.message,
      ErrorCode.UNKNOWN_ERROR,
      ErrorSeverity.MEDIUM,
      errorContext
    );
  }

  /**
   * MySQLエラーコードによるマッピング
   */
  private static mapByErrorCode(
    mysqlError: MySQLError,
    context: ErrorContext
  ): DatabaseError {
    switch (mysqlError.code) {
      // 重複キーエラー
      case "ER_DUP_ENTRY":
      case "ER_DUP_KEY":
        return new ConflictError(
          "重複するデータが存在します",
          context,
          ErrorSeverity.MEDIUM
        );

      // バリデーションエラー
      case "ER_BAD_NULL_ERROR":
      case "ER_NO_DEFAULT_FOR_FIELD":
      case "ER_DATA_TOO_LONG":
      case "ER_TRUNCATED_WRONG_VALUE":
        return new ValidationError(
          "データの形式または制約に違反しています",
          context,
          ErrorSeverity.MEDIUM
        );

      // 接続エラー
      case "PROTOCOL_CONNECTION_LOST":
      case "ECONNREFUSED":
      case "ENOTFOUND":
      case "EHOSTUNREACH":
        return new ConnectionError(
          "データベースへの接続に失敗しました",
          context,
          ErrorSeverity.HIGH
        );

      // 未発見エラー
      case "ER_NO_SUCH_TABLE":
      case "ER_BAD_TABLE_ERROR":
      case "ER_BAD_FIELD_ERROR":
        return new NotFoundError(
          "指定されたリソースが見つかりません",
          context,
          ErrorSeverity.LOW
        );

      // デッドロック
      case "ER_LOCK_DEADLOCK":
        return new DatabaseError(
          "デッドロックが発生しました",
          ErrorCode.DEADLOCK_ERROR,
          ErrorSeverity.MEDIUM,
          context
        );

      // その他
      default:
        return new DatabaseError(
          mysqlError.message,
          ErrorCode.UNKNOWN_ERROR,
          ErrorSeverity.MEDIUM,
          context
        );
    }
  }

  /**
   * MySQL errno によるマッピング
   */
  private static mapByErrno(
    mysqlError: MySQLError,
    context: ErrorContext
  ): DatabaseError {
    switch (mysqlError.errno) {
      case 1062: // ER_DUP_ENTRY
        return new ConflictError(
          "重複するデータが存在します",
          context,
          ErrorSeverity.MEDIUM
        );

      case 1048: // ER_BAD_NULL_ERROR
      case 1364: // ER_NO_DEFAULT_FOR_FIELD
        return new ValidationError(
          "データの形式または制約に違反しています",
          context,
          ErrorSeverity.MEDIUM
        );

      case 1146: // ER_NO_SUCH_TABLE
      case 1054: // ER_BAD_FIELD_ERROR
        return new NotFoundError(
          "指定されたリソースが見つかりません",
          context,
          ErrorSeverity.LOW
        );

      case 1213: // ER_LOCK_DEADLOCK
        return new DatabaseError(
          "デッドロックが発生しました",
          ErrorCode.DEADLOCK_ERROR,
          ErrorSeverity.MEDIUM,
          context
        );

      default:
        return new DatabaseError(
          mysqlError.message,
          ErrorCode.UNKNOWN_ERROR,
          ErrorSeverity.MEDIUM,
          context
        );
    }
  }

  /**
   * エラーコンテキストの構築
   */
  private static buildErrorContext(
    mysqlError: MySQLError,
    providedContext?: Partial<ErrorContext>
  ): ErrorContext {
    return {
      ...providedContext,
      originalError: {
        code: mysqlError.code,
        errno: mysqlError.errno,
        sqlState: mysqlError.sqlState,
        message: mysqlError.message,
      },
    };
  }
}
