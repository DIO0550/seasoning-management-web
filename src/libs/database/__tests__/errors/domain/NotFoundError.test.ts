import { describe, test, expect } from "vitest";
import { NotFoundError } from "../../../errors/domain/NotFoundError";
import { ErrorCode } from "../../../errors/base/ErrorCode";
import { ErrorSeverity } from "../../../errors/base/ErrorSeverity";

describe("NotFoundError", () => {
  test("NotFoundエラーを作成できる", () => {
    const error = new NotFoundError("ユーザーが見つかりません");

    expect(error.message).toBe("ユーザーが見つかりません");
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
    expect(error.severity).toBe(ErrorSeverity.LOW);
    expect(error.name).toBe("NotFoundError");
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
