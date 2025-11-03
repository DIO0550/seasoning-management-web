import { getTemplateNameValidationMessage } from "@/features/template/utils/nameValidationMessage";

describe("getTemplateNameValidationMessage", () => {
  test("有効な名前の場合は空文字を返す", () => {
    expect(getTemplateNameValidationMessage("朝食セット")).toBe("");
  });

  test("空文字の場合は必須メッセージを返す", () => {
    expect(getTemplateNameValidationMessage("")).toBe(
      "テンプレート名は必須です。"
    );
  });

  test("257文字以上の場合は文字数制限メッセージを返す", () => {
    const longName = "あ".repeat(257);
    expect(getTemplateNameValidationMessage(longName)).toBe(
      "テンプレート名は256文字以内で入力してください。"
    );
  });
});
