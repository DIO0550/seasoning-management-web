import { describe, test, expect, beforeEach } from "vitest";
import { ErrorTracker } from "../../monitoring/ErrorTracker";
import { DatabaseError } from "../../errors/base/DatabaseError";
import { ErrorCode } from "../../errors/base/ErrorCode";
import { ErrorSeverity } from "../../errors/base/ErrorSeverity";

describe("ErrorTracker", () => {
  let tracker: ErrorTracker;

  beforeEach(() => {
    tracker = new ErrorTracker();
  });

  test("エラー追跡機能を初期化できる", () => {
    expect(tracker).toBeDefined();
    expect(tracker.getErrorCount()).toBe(0);
  });

  test("エラーを記録できる", () => {
    const error = new DatabaseError(
      "テストエラー",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );

    tracker.trackError(error);

    expect(tracker.getErrorCount()).toBe(1);
  });

  test("複数のエラーを記録できる", () => {
    const error1 = new DatabaseError(
      "エラー1",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );
    const error2 = new DatabaseError(
      "エラー2",
      ErrorCode.CONNECTION_ERROR,
      ErrorSeverity.HIGH
    );

    tracker.trackError(error1);
    tracker.trackError(error2);

    expect(tracker.getErrorCount()).toBe(2);
  });

  test("重要度別のエラー統計を取得できる", () => {
    const lowError = new DatabaseError(
      "低重要度",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );
    const mediumError = new DatabaseError(
      "中重要度",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );
    const highError = new DatabaseError(
      "高重要度",
      ErrorCode.CONNECTION_ERROR,
      ErrorSeverity.HIGH
    );

    tracker.trackError(lowError);
    tracker.trackError(mediumError);
    tracker.trackError(mediumError); // 中重要度をもう一つ
    tracker.trackError(highError);

    const stats = tracker.getErrorStatistics();

    expect(stats.bySeverity[ErrorSeverity.LOW]).toBe(1);
    expect(stats.bySeverity[ErrorSeverity.MEDIUM]).toBe(2);
    expect(stats.bySeverity[ErrorSeverity.HIGH]).toBe(1);
    expect(stats.bySeverity[ErrorSeverity.CRITICAL]).toBe(0);
    expect(stats.total).toBe(4);
  });

  test("エラーコード別の統計を取得できる", () => {
    const notFoundError1 = new DatabaseError(
      "未発見1",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );
    const notFoundError2 = new DatabaseError(
      "未発見2",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );
    const validationError = new DatabaseError(
      "バリデーション",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );

    tracker.trackError(notFoundError1);
    tracker.trackError(notFoundError2);
    tracker.trackError(validationError);

    const stats = tracker.getErrorStatistics();

    expect(stats.byErrorCode[ErrorCode.NOT_FOUND]).toBe(2);
    expect(stats.byErrorCode[ErrorCode.VALIDATION_ERROR]).toBe(1);
  });

  test("最近のエラーを時系列順で取得できる", () => {
    const error1 = new DatabaseError(
      "1番目",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );
    const error2 = new DatabaseError(
      "2番目",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );
    const error3 = new DatabaseError(
      "3番目",
      ErrorCode.CONNECTION_ERROR,
      ErrorSeverity.HIGH
    );

    tracker.trackError(error1);
    tracker.trackError(error2);
    tracker.trackError(error3);

    const recentErrors = tracker.getRecentErrors(2);

    expect(recentErrors).toHaveLength(2);
    expect(recentErrors[0].message).toBe("3番目"); // 最新が最初
    expect(recentErrors[1].message).toBe("2番目");
  });

  test("指定した時間範囲のエラーを取得できる", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // 古いエラーを手動で追加（実際の実装では内部的にタイムスタンプを管理）
    const oldError = new DatabaseError(
      "古いエラー",
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW
    );
    const recentError = new DatabaseError(
      "新しいエラー",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );

    tracker.trackError(oldError);
    tracker.trackError(recentError);

    // 1時間以内のエラーを取得
    const recentErrorsInHour = tracker.getErrorsInTimeRange(oneHourAgo, now);

    expect(recentErrorsInHour.length).toBeGreaterThan(0);
  });

  test("エラー統計をリセットできる", () => {
    const error = new DatabaseError(
      "テスト",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );

    tracker.trackError(error);
    expect(tracker.getErrorCount()).toBe(1);

    tracker.reset();
    expect(tracker.getErrorCount()).toBe(0);

    const stats = tracker.getErrorStatistics();
    expect(stats.total).toBe(0);
  });

  test("エラー発生頻度を計算できる", () => {
    const error = new DatabaseError(
      "頻度テスト",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );

    // 複数のエラーを短時間で発生させる
    tracker.trackError(error);
    tracker.trackError(error);
    tracker.trackError(error);

    const frequency = tracker.getErrorFrequency(60); // 過去60秒
    expect(frequency).toBeGreaterThan(0);
  });
});
