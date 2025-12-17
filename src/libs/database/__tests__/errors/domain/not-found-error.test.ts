import { describe, test, expect } from "vitest";
import { NotFoundError } from "../../../errors/domain/not-found-error";
import { ErrorCode } from "../../../errors/base/error-code";
import { ErrorSeverity } from "../../../errors/base/error-severity";

describe("not-found-error", () => {
  test("NotFoundエラーを作成できる", () => {
    const error = new NotFoundError("ユーザーが見つかりません");

    expect(error.message).toBe("ユーザーが見つかりません");
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
    expect(error.severity).toBe(ErrorSeverity.LOW);
    expect(error.name).toBe("not-found-error");
  });

  test("リソース情報を保持できる", () => {
    const context = {
      resource: "User",
      id: "123",
      query: { name: "John" },
    };

    const error = new NotFoundError(
      "指定されたリソースが見つかりません",
      context
    );

    expect(error.context).toEqual(context);
  });

  test("カスタム重要度を設定できる", () => {
    const error = new NotFoundError(
      "重要なリソースが見つかりません",
      { resource: "CriticalData" },
      ErrorSeverity.HIGH
    );

    expect(error.severity).toBe(ErrorSeverity.HIGH);
  });
});
