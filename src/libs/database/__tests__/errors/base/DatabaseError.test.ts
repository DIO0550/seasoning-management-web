import { describe, test, expect } from "vitest";
import { DatabaseError } from "../../../errors/base/DatabaseError";
import { ErrorCode } from "../../../errors/base/ErrorCode";
import { ErrorSeverity } from "../../../errors/base/ErrorSeverity";

describe("DatabaseError", () => {
  test("基本的なエラー情報を保持できる", () => {
    const error = new DatabaseError(
      "テストエラーメッセージ",
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );

    expect(error.message).toBe("テストエラーメッセージ");
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    expect(error.name).toBe("DatabaseError");
    expect(error instanceof Error).toBe(true);
  });

  test("タイムスタンプが自動設定される", () => {
    const beforeCreation = new Date();
    const error = new DatabaseError(
      "テストメッセージ",
      ErrorCode.UNKNOWN_ERROR,
      ErrorSeverity.LOW
    );
    const afterCreation = new Date();

    expect(error.timestamp).toBeInstanceOf(Date);
    expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime()
    );
    expect(error.timestamp.getTime()).toBeLessThanOrEqual(
      afterCreation.getTime()
    );
  });

  test("オプションのコンテキスト情報を保持できる", () => {
    const context = {
      userId: "123",
      operation: "create",
      table: "seasoning",
    };

    const error = new DatabaseError(
      "テストメッセージ",
      ErrorCode.CONSTRAINT_VIOLATION,
      ErrorSeverity.HIGH,
      context
    );

    expect(error.context).toEqual(context);
  });

  test("コンテキストなしでもエラーを作成できる", () => {
    const error = new DatabaseError(
      "テストメッセージ",
      ErrorCode.UNKNOWN_ERROR,
      ErrorSeverity.LOW
    );

    expect(error.context).toBeUndefined();
  });

  test("スタックトレースが保持される", () => {
    const error = new DatabaseError(
      "テストメッセージ",
      ErrorCode.CONNECTION_ERROR,
      ErrorSeverity.CRITICAL
    );

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("DatabaseError");
  });

  test("JSON形式でシリアライズできる", () => {
    const context = { table: "seasoning_type" };
    const error = new DatabaseError(
      "JSONテストメッセージ",
      ErrorCode.DUPLICATE_KEY,
      ErrorSeverity.MEDIUM,
      context
    );

    const json = error.toJSON();

    expect(json).toEqual({
      name: "DatabaseError",
      message: "JSONテストメッセージ",
      code: ErrorCode.DUPLICATE_KEY,
      severity: ErrorSeverity.MEDIUM,
      timestamp: error.timestamp.toISOString(),
      context: context,
    });
  });

  test("toStringメソッドで適切な文字列表現を返す", () => {
    const error = new DatabaseError(
      "テスト文字列メッセージ",
      ErrorCode.NETWORK_ERROR,
      ErrorSeverity.HIGH
    );

    const stringRepresentation = error.toString();

    expect(stringRepresentation).toContain("DatabaseError");
    expect(stringRepresentation).toContain("テスト文字列メッセージ");
    expect(stringRepresentation).toContain(ErrorCode.NETWORK_ERROR);
    expect(stringRepresentation).toContain(ErrorSeverity.HIGH);
  });
});
