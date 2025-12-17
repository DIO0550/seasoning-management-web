import { describe, test, expect } from "vitest";
import { ValidationError } from "../../../errors/domain/validation-error";
import { ErrorCode } from "../../../errors/base/error-code";
import { ErrorSeverity } from "../../../errors/base/error-severity";

describe("validation-error", () => {
  test("バリデーションエラーを作成できる", () => {
    const error = new ValidationError("名前は必須です");

    expect(error.message).toBe("名前は必須です");
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    expect(error.name).toBe("validation-error");
    expect(error instanceof Error).toBe(true);
  });

  test("フィールド情報を保持できる", () => {
    const error = new ValidationError("無効な値です", { field: "name" });

    expect(error.context).toEqual({ field: "name" });
  });

  test("複数フィールドのバリデーションエラーを作成できる", () => {
    const context = {
      fields: ["name", "email"],
      invalidValues: { name: "", email: "invalid-email" },
    };

    const error = new ValidationError(
      "複数のフィールドでエラーが発生しました",
      context
    );

    expect(error.context).toEqual(context);
  });

  test("カスタム重要度を設定できる", () => {
    const error = new ValidationError(
      "クリティカルなバリデーションエラー",
      { field: "id" },
      ErrorSeverity.HIGH
    );

    expect(error.severity).toBe(ErrorSeverity.HIGH);
  });
});
