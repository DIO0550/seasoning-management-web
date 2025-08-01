import { describe, test, expect } from "vitest";
import { ConflictError } from "../../../errors/domain/ConflictError";
import { ErrorCode } from "../../../errors/base/ErrorCode";
import { ErrorSeverity } from "../../../errors/base/ErrorSeverity";

describe("ConflictError", () => {
  test("競合エラーを作成できる", () => {
    const error = new ConflictError("データが既に存在します");

    expect(error.message).toBe("データが既に存在します");
    expect(error.code).toBe(ErrorCode.DUPLICATE_KEY);
    expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    expect(error.name).toBe("ConflictError");
  });

  test("競合情報を保持できる", () => {
    const context = {
      table: "users",
      conflictingField: "email",
      conflictingValue: "test@example.com",
    };

    const error = new ConflictError("メールアドレスが重複しています", context);

    expect(error.context).toEqual(context);
  });
});
