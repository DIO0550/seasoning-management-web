import { validateTemplateName } from "./templateNameValidation";

describe("validateTemplateName", () => {
  test("有効な名前の場合はtrueを返す", () => {
    expect(validateTemplateName("朝食セット")).toBe(true);
  });

  test("空文字の場合はfalseを返す", () => {
    expect(validateTemplateName("")).toBe(false);
  });

  test("20文字以内の場合はtrueを返す", () => {
    expect(
      validateTemplateName("あいうえおかきくけこさしすせそたちつてと")
    ).toBe(true); // 20文字
  });

  test("21文字以上の場合はfalseを返す", () => {
    expect(
      validateTemplateName("あいうえおかきくけこさしすせそたちつてとな")
    ).toBe(false); // 21文字
  });
});
