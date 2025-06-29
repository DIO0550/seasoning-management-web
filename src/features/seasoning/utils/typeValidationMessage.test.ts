import { describe, test, expect } from "vitest";
import { typeValidationErrorMessage } from "./typeValidationMessage";

describe("typeValidationErrorMessage", () => {
  test("REQUIREDエラーの場合に適切なメッセージを返す", () => {
    const result = typeValidationErrorMessage("REQUIRED");
    expect(result).toBe("調味料の種類を選択してください");
  });

  test("NONEの場合に空文字を返す", () => {
    const result = typeValidationErrorMessage("NONE");
    expect(result).toBe("");
  });
});
