import { DatabaseError } from "../errors/base/DatabaseError";
import { ErrorCode } from "../errors/base/ErrorCode";
import { ErrorSeverity } from "../errors/base/ErrorSeverity";

/**
 * エラー統計情報
 */
export interface ErrorStatistics {
  /**
   * 総エラー数
   */
  total: number;

  /**
   * 重要度別エラー数
   */
  bySeverity: Record<ErrorSeverity, number>;

  /**
   * エラーコード別エラー数
   */
  byErrorCode: Record<string, number>;

  /**
   * 最初のエラー発生時刻
   */
  firstErrorAt?: Date;

  /**
   * 最後のエラー発生時刻
   */
  lastErrorAt?: Date;
}

/**
 * 記録されたエラー情報
 */
interface TrackedError {
  error: DatabaseError;
  trackedAt: Date;
}

/**
 * エラー発生を追跡・分析するクラス
 */
export class ErrorTracker {
  private readonly errors: TrackedError[] = [];
  private readonly maxStoredErrors: number;

  constructor(maxStoredErrors: number = 1000) {
    this.maxStoredErrors = maxStoredErrors;
  }

  /**
   * エラーを記録
   */
  trackError(error: DatabaseError): void {
    const trackedError: TrackedError = {
      error,
      trackedAt: new Date(),
    };

    this.errors.push(trackedError);

    // 最大保存数を超えた場合、古いエラーを削除
    if (this.errors.length > this.maxStoredErrors) {
      this.errors.shift(); // 最古のエラーを削除
    }
  }

  /**
   * 総エラー数を取得
   */
  getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * エラー統計を取得
   */
  getErrorStatistics(): ErrorStatistics {
    const bySeverity: Record<ErrorSeverity, number> = {
      [ErrorSeverity.INFO]: 0,
      [ErrorSeverity.LOW]: 0,
      [ErrorSeverity.MEDIUM]: 0,
      [ErrorSeverity.HIGH]: 0,
      [ErrorSeverity.CRITICAL]: 0,
    };

    const byErrorCode: Record<string, number> = {};

    let firstErrorAt: Date | undefined;
    let lastErrorAt: Date | undefined;

    this.errors.forEach(({ error, trackedAt }) => {
      // 重要度別カウント
      bySeverity[error.severity]++;

      // エラーコード別カウント
      byErrorCode[error.code] = (byErrorCode[error.code] || 0) + 1;

      // 時刻の追跡
      if (!firstErrorAt || trackedAt < firstErrorAt) {
        firstErrorAt = trackedAt;
      }
      if (!lastErrorAt || trackedAt > lastErrorAt) {
        lastErrorAt = trackedAt;
      }
    });

    return {
      total: this.errors.length,
      bySeverity,
      byErrorCode,
      firstErrorAt,
      lastErrorAt,
    };
  }

  /**
   * 最近のエラーを取得（新しい順）
   */
  getRecentErrors(limit: number = 10): DatabaseError[] {
    return this.errors
      .slice(-limit)
      .reverse() // 新しい順にソート
      .map(({ error }) => error);
  }

  /**
   * 指定した時間範囲のエラーを取得
   */
  getErrorsInTimeRange(startTime: Date, endTime: Date): DatabaseError[] {
    return this.errors
      .filter(({ trackedAt }) => trackedAt >= startTime && trackedAt <= endTime)
      .map(({ error }) => error);
  }

  /**
   * 指定した期間でのエラー発生頻度を計算（エラー数/秒）
   */
  getErrorFrequency(periodSeconds: number): number {
    const now = new Date();
    const startTime = new Date(now.getTime() - periodSeconds * 1000);

    const errorsInPeriod = this.errors.filter(
      ({ trackedAt }) => trackedAt >= startTime
    );

    return errorsInPeriod.length / periodSeconds;
  }

  /**
   * 特定の重要度のエラーを取得
   */
  getErrorsBySeverity(severity: ErrorSeverity): DatabaseError[] {
    return this.errors
      .filter(({ error }) => error.severity === severity)
      .map(({ error }) => error);
  }

  /**
   * 特定のエラーコードのエラーを取得
   */
  getErrorsByCode(errorCode: ErrorCode): DatabaseError[] {
    return this.errors
      .filter(({ error }) => error.code === errorCode)
      .map(({ error }) => error);
  }

  /**
   * エラー追跡をリセット
   */
  reset(): void {
    this.errors.length = 0;
  }

  /**
   * エラー傾向を分析（例：最も頻繁に発生するエラーコード）
   */
  analyzeErrorTrends(): {
    mostCommonErrorCode: string;
    mostCommonSeverity: ErrorSeverity;
    averageErrorsPerHour: number;
  } {
    const stats = this.getErrorStatistics();

    // 最も頻繁に発生するエラーコード
    let mostCommonErrorCode = "";
    let maxErrorCodeCount = 0;

    Object.entries(stats.byErrorCode).forEach(([code, count]) => {
      if (count > maxErrorCodeCount) {
        maxErrorCodeCount = count;
        mostCommonErrorCode = code;
      }
    });

    // 最も頻繁に発生する重要度
    let mostCommonSeverity: ErrorSeverity = ErrorSeverity.INFO;
    let maxSeverityCount = 0;

    (Object.entries(stats.bySeverity) as [ErrorSeverity, number][]).forEach(
      ([severity, count]) => {
        if (count > maxSeverityCount) {
          maxSeverityCount = count;
          mostCommonSeverity = severity;
        }
      }
    );

    // 時間あたりの平均エラー数
    let averageErrorsPerHour = 0;
    if (stats.firstErrorAt && stats.lastErrorAt) {
      const hoursDiff =
        (stats.lastErrorAt.getTime() - stats.firstErrorAt.getTime()) /
        (1000 * 60 * 60);
      if (hoursDiff > 0) {
        averageErrorsPerHour = stats.total / hoursDiff;
      }
    }

    return {
      mostCommonErrorCode,
      mostCommonSeverity,
      averageErrorsPerHour,
    };
  }
}
