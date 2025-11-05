import { nameValidationErrorMessage } from "../name-validation-message";

describe("nameValidationErrorMessage", () => {
  test("REQUIRED エラーの場合、必須メッセージを返す", () => {
    const result = nameValidationErrorMessage("REQUIRED");
    expect(result).toBe("調味料名は必須です");
  });

  test("LENGTH_EXCEEDED エラーの場合、文字数制限メッセージを返す", () => {
    const result = nameValidationErrorMessage("LENGTH_EXCEEDED");
    expect(result).toBe("調味料名は 256 文字以内で入力してください");
  });

  test("INVALID_FORMAT エラーの場合、形式エラーメッセージを返す", () => {
    const result = nameValidationErrorMessage("INVALID_FORMAT");
    expect(result).toBe("調味料名は半角英数字で入力してください");
  });

  test("NONE エラーの場合、空文字を返す", () => {
    const result = nameValidationErrorMessage("NONE");
    expect(result).toBe("");
  });
});
