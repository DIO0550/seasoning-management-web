import { validateTemplateDescription } from "./templateDescriptionValidation";

describe("validateTemplateDescription", () => {
  test("空文字の場合はtrueを返す（任意項目のため）", () => {
    expect(validateTemplateDescription("")).toBe(true);
  });

  test("200文字以内の場合はtrueを返す", () => {
    const description = "あ".repeat(200);
    expect(validateTemplateDescription(description)).toBe(true);
  });

  test("201文字以上の場合はfalseを返す", () => {
    const description = "あ".repeat(201);
    expect(validateTemplateDescription(description)).toBe(false);
  });

  test("有効な説明文の場合はtrueを返す", () => {
    expect(
      validateTemplateDescription("朝食に使う調味料のテンプレートです。")
    ).toBe(true);
  });
});
