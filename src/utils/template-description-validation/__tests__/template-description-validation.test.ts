import { validateTemplateDescription } from "@/utils/template-description-validation/template-description-validation";
import { TEMPLATE_DESCRIPTION_MAX_LENGTH } from "@/constants/validation/descriptionValidation";

describe("validateTemplateDescription", () => {
  test("空文字の場合はtrueを返す（任意項目のため）", () => {
    expect(validateTemplateDescription("")).toBe(true);
  });

  test(`${TEMPLATE_DESCRIPTION_MAX_LENGTH}文字以内の場合はtrueを返す`, () => {
    const description = "あ".repeat(TEMPLATE_DESCRIPTION_MAX_LENGTH);
    expect(validateTemplateDescription(description)).toBe(true);
  });

  test(`${
    TEMPLATE_DESCRIPTION_MAX_LENGTH + 1
  }文字以上の場合はfalseを返す`, () => {
    const description = "あ".repeat(TEMPLATE_DESCRIPTION_MAX_LENGTH + 1);
    expect(validateTemplateDescription(description)).toBe(false);
  });

  test("有効な説明文の場合はtrueを返す", () => {
    expect(
      validateTemplateDescription("朝食に使う調味料のテンプレートです。")
    ).toBe(true);
  });
});
