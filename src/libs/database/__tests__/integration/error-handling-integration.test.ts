import { describe, test, expect, vi, beforeEach } from "vitest";
import { DatabaseError } from "../../errors/base/database-error";
import { ErrorCode } from "../../errors/base/error-code";
import { ErrorSeverity } from "../../errors/base/error-severity";
import { MySQLErrorMapper } from "../../errors/mapping/my-sql-error-mapper";
import { MySQLError } from "../../errors/mapping/error-context";
import { StructuredLogger } from "../../logging/implementations/structured-logger";
import { LogLevel } from "../../logging/formatters/log-level";
import { ErrorNotifier } from "../../monitoring/error-notifier";
import { ErrorTracker } from "../../monitoring/error-tracker";

describe("Error Handling and Logging System Integration", () => {
  let logger: StructuredLogger;
  let notifier: ErrorNotifier;
  let tracker: ErrorTracker;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger = new StructuredLogger(LogLevel.DEBUG);
    notifier = new ErrorNotifier(logger);
    tracker = new ErrorTracker();
  });

  test("統合されたエラーハンドリングシステムが動作する", () => {
    // 1. MySQLエラーをドメインエラーにマップ
    const mysqlError = new Error(
      "Duplicate entry 'test@example.com' for key 'email'"
    ) as MySQLError;
    mysqlError.code = "ER_DUP_ENTRY";
    mysqlError.errno = 1062;

    const mappedError = MySQLErrorMapper.mapError(mysqlError, {
      table: "users",
      operation: "INSERT",
    });

    // 2. エラーを追跡
    tracker.trackError(mappedError);

    // 3. エラーを通知
    notifier.notifyError(mappedError);

    // 検証
    expect(mappedError.code).toBe(ErrorCode.DUPLICATE_KEY);
    expect(tracker.getErrorCount()).toBe(1);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("複数のエラータイプが適切に処理される", () => {
    // バリデーションエラー
    const validationError = new DatabaseError(
      "必須フィールドが不足しています",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM,
      { field: "name" }
    );

    // 接続エラー
    const connectionError = new DatabaseError(
      "データベースに接続できません",
      ErrorCode.CONNECTION_ERROR,
      ErrorSeverity.CRITICAL
    );

    // エラーを処理
    [validationError, connectionError].forEach((error) => {
      tracker.trackError(error);
      notifier.notifyError(error);
    });

    // 統計の確認
    const stats = tracker.getErrorStatistics();
    expect(stats.total).toBe(2);
    expect(stats.bySeverity[ErrorSeverity.MEDIUM]).toBe(1);
    expect(stats.bySeverity[ErrorSeverity.CRITICAL]).toBe(1);

    // ログ出力の確認
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  test("エラーフィルタリングが正しく動作する", () => {
    const filteredNotifier = new ErrorNotifier(logger, {
      minSeverity: ErrorSeverity.HIGH,
    });

    const lowError = new DatabaseError(
      "軽微なエラー",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );

    const highError = new DatabaseError(
      "重要なエラー",
      ErrorCode.CONNECTION_ERROR,
      ErrorSeverity.HIGH
    );

    // 両方のエラーを処理
    filteredNotifier.notifyError(lowError);
    filteredNotifier.notifyError(highError);

    // HIGHレベルのエラーのみログ出力される
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test("構造化ログの形式が正しい", () => {
    const error = new DatabaseError(
      "テストエラーメッセージ",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.HIGH,
      { userId: "123", operation: "create" }
    );

    notifier.notifyError(error);

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logOutput = JSON.parse(consoleSpy.mock.calls[0][0] as string);

    // 構造化ログの形式チェック
    expect(logOutput).toHaveProperty("level");
    expect(logOutput).toHaveProperty("message");
    expect(logOutput).toHaveProperty("timestamp");
    expect(logOutput).toHaveProperty("source", "error-notifier");
    expect(logOutput).toHaveProperty("metadata");
    expect(logOutput.metadata).toHaveProperty(
      "error-code",
      ErrorCode.VALIDATION_ERROR
    );
    expect(logOutput.metadata).toHaveProperty("severity", ErrorSeverity.HIGH);
  });

  test("エラー追跡の分析機能が動作する", () => {
    // 複数の同種エラーを生成
    const errors = [
      new DatabaseError(
        "バリデーション1",
        ErrorCode.VALIDATION_ERROR,
        ErrorSeverity.MEDIUM
      ),
      new DatabaseError(
        "バリデーション2",
        ErrorCode.VALIDATION_ERROR,
        ErrorSeverity.MEDIUM
      ),
      new DatabaseError(
        "接続エラー",
        ErrorCode.CONNECTION_ERROR,
        ErrorSeverity.HIGH
      ),
    ];

    errors.forEach((error) => tracker.trackError(error));

    const trends = tracker.analyzeErrorTrends();

    expect(trends.mostCommonErrorCode).toBe(ErrorCode.VALIDATION_ERROR);
    expect(trends.mostCommonSeverity).toBe(ErrorSeverity.MEDIUM);
  });

  test("MySQLエラーマッピングの包括的テスト", () => {
    const testCases = [
      {
        mysqlCode: "ER_DUP_ENTRY",
        errno: 1062,
        expectedCode: ErrorCode.DUPLICATE_KEY,
        message: "Duplicate entry",
      },
      {
        mysqlCode: "ER_BAD_NULL_ERROR",
        errno: 1048,
        expectedCode: ErrorCode.VALIDATION_ERROR,
        message: "Column cannot be null",
      },
      {
        mysqlCode: "ER_NO_SUCH_TABLE",
        errno: 1146,
        expectedCode: ErrorCode.NOT_FOUND,
        message: "Table does not exist",
      },
    ];

    testCases.forEach(({ mysqlCode, errno, expectedCode, message }) => {
      const mysqlError = new Error(message) as MySQLError;
      mysqlError.code = mysqlCode;
      mysqlError.errno = errno;

      const mappedError = MySQLErrorMapper.mapError(mysqlError);

      expect(mappedError.code).toBe(expectedCode);
      expect(mappedError).toBeInstanceOf(DatabaseError);
    });
  });
});
