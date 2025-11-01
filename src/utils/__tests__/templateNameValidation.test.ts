import { validateTemplateName } from "@/utils/templateNameValidation";
import { TEMPLATE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

describe("validateTemplateName", () => {
  test("有効な名前の場合はtrueを返す", () => {
    expect(validateTemplateName("朝食セット")).toBe(true);
  });

  test("空文字の場合はfalseを返す", () => {
    expect(validateTemplateName("")).toBe(false);
  });

  test(`${TEMPLATE_NAME_MAX_LENGTH}文字以内の場合はtrueを返す`, () => {
    expect(validateTemplateName("あ".repeat(TEMPLATE_NAME_MAX_LENGTH))).toBe(
      true
    ); // 20文字
  });

  test(`${TEMPLATE_NAME_MAX_LENGTH + 1}文字以上の場合はfalseを返す`, () => {
    expect(
      validateTemplateName("あ".repeat(TEMPLATE_NAME_MAX_LENGTH + 1))
    ).toBe(false); // 21文字
  });
});
