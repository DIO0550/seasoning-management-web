import { DatabaseError } from "../errors/base/database-error";
import { ErrorSeverity } from "../errors/base/error-severity";
import { ILogger } from "../logging/interfaces/i-logger";

/**
 * エラー通知の設定オプション
 */
export interface ErrorNotificationOptions {
  /**
   * 通知する最小重要度レベル
   */
  minSeverity?: ErrorSeverity;

  /**
   * 通知を抑制するエラーコードのリスト
   */
  suppressedErrorCodes?: string[];

  /**
   * 開発環境での動作制御
   */
  isDevelopment?: boolean;
}

/**
 * エラー通知を管理するクラス
 */
export class ErrorNotifier {
  private readonly logger: ILogger;
  private readonly options: ErrorNotificationOptions;

  /**
   * 重要度レベルの優先度マッピング
   */
  private readonly severityPriority: Record<ErrorSeverity, number> = {
    [ErrorSeverity.INFO]: 0,
    [ErrorSeverity.LOW]: 1,
    [ErrorSeverity.MEDIUM]: 2,
    [ErrorSeverity.HIGH]: 3,
    [ErrorSeverity.CRITICAL]: 4,
  };

  constructor(logger: ILogger, options: ErrorNotificationOptions = {}) {
    this.logger = logger;
    this.options = {
      minSeverity: ErrorSeverity.INFO,
      suppressedErrorCodes: [],
      isDevelopment: process.env.NODE_ENV === "development",
      ...options,
    };
  }

  /**
   * エラーを適切なレベルで通知
   */
  notifyError(error: DatabaseError): void {
    if (!this.shouldNotify(error)) {
      return;
    }

    const metadata = this.buildNotificationMetadata(error);
    const message = `${error.severity} エラーが発生しました: ${error.message}`;

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        this.logger.fatal(message, error, metadata, "error-notifier");
        break;

      case ErrorSeverity.HIGH:
        this.logger.error(message, error, metadata, "error-notifier");
        break;

      case ErrorSeverity.MEDIUM:
        this.logger.warn(message, metadata, "error-notifier");
        break;

      case ErrorSeverity.LOW:
        this.logger.info(message, metadata, "error-notifier");
        break;

      case ErrorSeverity.INFO:
        this.logger.debug(message, metadata, "error-notifier");
        break;
    }
  }

  /**
   * エラーが通知対象かどうかを判定
   */
  private shouldNotify(error: DatabaseError): boolean {
    // 最小重要度レベルチェック
    if (this.options.minSeverity) {
      const errorPriority = this.severityPriority[error.severity];
      const minPriority = this.severityPriority[this.options.minSeverity];

      if (errorPriority < minPriority) {
        return false;
      }
    }

    // 抑制されたエラーコードチェック
    if (this.options.suppressedErrorCodes?.includes(error.code)) {
      return false;
    }

    return true;
  }

  /**
   * 通知用のメタデータを構築
   */
  private buildNotificationMetadata(
    error: DatabaseError
  ): Record<string, unknown> {
    return {
      errorCode: error.code,
      severity: error.severity,
      timestamp: error.timestamp.toISOString(),
      originalContext: error.context,
      environment: this.options.isDevelopment ? "development" : "production",
    };
  }
}
