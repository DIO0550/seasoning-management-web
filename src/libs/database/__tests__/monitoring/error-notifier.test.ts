import { describe, test, expect, vi, beforeEach } from "vitest";
import { ErrorNotifier } from "../../monitoring/error-notifier";
import { DatabaseError } from "../../errors/base/database-error";
import { ErrorCode } from "../../errors/base/error-code";
import { ErrorSeverity } from "../../errors/base/error-severity";
import { ILogger } from "../../logging/interfaces/i-logger";
import { LogLevel } from "../../logging/formatters/log-level";

// モックロガー
const mockLogger: ILogger = {
  minLevel: LogLevel.INFO,
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  log: vi.fn(),
  isLevelEnabled: vi.fn().mockReturnValue(true),
};

describe("error-notifier", () => {
  let notifier: ErrorNotifier;

  beforeEach(() => {
    vi.clearAllMocks();
    notifier = new ErrorNotifier(mockLogger);
  });

  test("エラー通知機能を初期化できる", () => {
    expect(notifier).toBeDefined();
  });

  test("重要度がCRITICALのエラーを通知できる", () => {
    const criticalError = new DatabaseError(
      "クリティカルエラー",
      ErrorCode.CONNECTION_ERROR,
      ErrorSeverity.CRITICAL
    );

    notifier.notifyError(criticalError);

    expect(mockLogger.fatal).toHaveBeenCalledWith(
      "CRITICAL エラーが発生しました: クリティカルエラー",
      criticalError,
      expect.objectContaining({
        errorCode: ErrorCode.CONNECTION_ERROR,
        severity: ErrorSeverity.CRITICAL,
        timestamp: expect.any(String),
      }),
      "error-notifier"
    );
  });

  test("重要度がHIGHのエラーを通知できる", () => {
    const highError = new DatabaseError(
      "重要なエラー",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.HIGH
    );

    notifier.notifyError(highError);

    expect(mockLogger.error).toHaveBeenCalledWith(
      "HIGH エラーが発生しました: 重要なエラー",
      highError,
      expect.objectContaining({
        errorCode: ErrorCode.VALIDATION_ERROR,
        severity: ErrorSeverity.HIGH,
      }),
      "error-notifier"
    );
  });

  test("重要度がMEDIUMのエラーを通知できる", () => {
    const mediumError = new DatabaseError(
      "中程度のエラー",
      ErrorCode.DUPLICATE_KEY,
      ErrorSeverity.MEDIUM
    );

    notifier.notifyError(mediumError);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      "MEDIUM エラーが発生しました: 中程度のエラー",
      expect.objectContaining({
        errorCode: ErrorCode.DUPLICATE_KEY,
        severity: ErrorSeverity.MEDIUM,
      }),
      "error-notifier"
    );
  });

  test("重要度がLOWのエラーを通知できる", () => {
    const lowError = new DatabaseError(
      "軽微なエラー",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );

    notifier.notifyError(lowError);

    expect(mockLogger.info).toHaveBeenCalledWith(
      "LOW エラーが発生しました: 軽微なエラー",
      expect.objectContaining({
        errorCode: ErrorCode.NOT_FOUND,
        severity: ErrorSeverity.LOW,
      }),
      "error-notifier"
    );
  });

  test("重要度がINFOのエラーを通知できる", () => {
    const infoError = new DatabaseError(
      "情報レベル",
      ErrorCode.UNKNOWN_ERROR,
      ErrorSeverity.INFO
    );

    notifier.notifyError(infoError);

    expect(mockLogger.debug).toHaveBeenCalledWith(
      "INFO エラーが発生しました: 情報レベル",
      expect.objectContaining({
        errorCode: ErrorCode.UNKNOWN_ERROR,
        severity: ErrorSeverity.INFO,
      }),
      "error-notifier"
    );
  });

  test("エラーコンテキスト情報も通知に含める", () => {
    const contextError = new DatabaseError(
      "コンテキスト付きエラー",
      ErrorCode.TRANSACTION_ERROR,
      ErrorSeverity.HIGH,
      { userId: "123", operation: "update", table: "seasoning" }
    );

    notifier.notifyError(contextError);

    expect(mockLogger.error).toHaveBeenCalledWith(
      "HIGH エラーが発生しました: コンテキスト付きエラー",
      contextError,
      expect.objectContaining({
        errorCode: ErrorCode.TRANSACTION_ERROR,
        severity: ErrorSeverity.HIGH,
        originalContext: {
          userId: "123",
          operation: "update",
          table: "seasoning",
        },
      }),
      "error-notifier"
    );
  });

  test("通知フィルタリング機能が動作する", () => {
    const filterNotifier = new ErrorNotifier(mockLogger, {
      minSeverity: ErrorSeverity.HIGH,
    });

    const lowError = new DatabaseError(
      "フィルタされるエラー",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );

    filterNotifier.notifyError(lowError);

    // LOWレベルなので通知されない
    expect(mockLogger.info).not.toHaveBeenCalled();
    expect(mockLogger.warn).not.toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(mockLogger.fatal).not.toHaveBeenCalled();
  });
});
