import { describe, test, expect, vi, beforeEach } from "vitest";
import { StructuredLogger } from "../../../logging/implementations/structured-logger";
import { LogLevel } from "../../../logging/formatters/log-level";
import { ILogEntry } from "../../../logging/interfaces/i-log-entry";

describe("structured-logger", () => {
  let logger: StructuredLogger;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger = new StructuredLogger(LogLevel.DEBUG);
  });

  test("指定されたログレベルでロガーを作成できる", () => {
    const infoLogger = new StructuredLogger(LogLevel.INFO);

    expect(infoLogger.minLevel).toBe(LogLevel.INFO);
  });

  test("デバッグログを出力できる", () => {
    const metadata = { userId: "123", action: "test" };

    logger.debug("デバッグメッセージ", metadata, "TestClass");

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logOutput = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(logOutput.level).toBe(LogLevel.DEBUG);
    expect(logOutput.message).toBe("デバッグメッセージ");
    expect(logOutput.source).toBe("TestClass");
    expect(logOutput.metadata).toEqual(metadata);
  });

  test("情報ログを出力できる", () => {
    logger.info("情報メッセージ", { operation: "create" });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logOutput = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(logOutput.level).toBe(LogLevel.INFO);
    expect(logOutput.message).toBe("情報メッセージ");
  });

  test("エラーログでエラー情報を適切に処理できる", () => {
    const error = new Error("テストエラー");
    error.name = "TestError";

    logger.error("エラーが発生しました", error, { context: "test" });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logOutput = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(logOutput.level).toBe(LogLevel.ERROR);
    expect(logOutput.error.name).toBe("TestError");
    expect(logOutput.error.message).toBe("テストエラー");
    expect(logOutput.error.stack).toBeDefined();
  });

  test("ログレベル制御が正しく動作する", () => {
    const infoLogger = new StructuredLogger(LogLevel.INFO);

    infoLogger.debug("デバッグメッセージ"); // 出力されない
    infoLogger.info("情報メッセージ"); // 出力される

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logOutput = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(logOutput.level).toBe(LogLevel.INFO);
  });

  test("isLevelEnabledメソッドが正しく動作する", () => {
    const warnLogger = new StructuredLogger(LogLevel.WARN);

    expect(warnLogger.isLevelEnabled(LogLevel.DEBUG)).toBe(false);
    expect(warnLogger.isLevelEnabled(LogLevel.INFO)).toBe(false);
    expect(warnLogger.isLevelEnabled(LogLevel.WARN)).toBe(true);
    expect(warnLogger.isLevelEnabled(LogLevel.ERROR)).toBe(true);
    expect(warnLogger.isLevelEnabled(LogLevel.FATAL)).toBe(true);
  });

  test("ログエントリを直接出力できる", () => {
    const logEntry: ILogEntry = {
      level: LogLevel.WARN,
      message: "直接ログエントリ",
      timestamp: new Date(),
      source: "DirectTest",
      metadata: { direct: true },
    };

    logger.log(logEntry);

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logOutput = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(logOutput.level).toBe(LogLevel.WARN);
    expect(logOutput.message).toBe("直接ログエントリ");
    expect(logOutput.source).toBe("DirectTest");
  });

  test("タイムスタンプが自動設定される", () => {
    const beforeLog = new Date();

    logger.info("タイムスタンプテスト");

    const afterLog = new Date();
    const logOutput = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    const logTimestamp = new Date(logOutput.timestamp);

    expect(logTimestamp.getTime()).toBeGreaterThanOrEqual(beforeLog.getTime());
    expect(logTimestamp.getTime()).toBeLessThanOrEqual(afterLog.getTime());
  });
});
