import { validateSeasoningTypeName } from "./seasoningTypeNameValidation";

describe("validateSeasoningTypeName", () => {
  test("空の文字列の場合、REQUIRED エラーを返す", () => {
    const result = validateSeasoningTypeName("");
    expect(result).toBe("REQUIRED");
  });

  test("空白のみの文字列の場合、REQUIRED エラーを返す", () => {
    const result = validateSeasoningTypeName("   ");
    expect(result).toBe("REQUIRED");
  });

  test("有効な調味料の種類名の場合、NONE を返す", () => {
    const result = validateSeasoningTypeName("香辛料");
    expect(result).toBe("NONE");
  });

  test("最大文字数を超えた場合、LENGTH_EXCEEDED エラーを返す", () => {
    const longName = "あ".repeat(51); // 51文字
    const result = validateSeasoningTypeName(longName);
    expect(result).toBe("LENGTH_EXCEEDED");
  });

  test("最大文字数ちょうど（50文字）の場合、NONE を返す", () => {
    const maxLengthName = "あ".repeat(50);
    const result = validateSeasoningTypeName(maxLengthName);
    expect(result).toBe("NONE");
  });

  test("前後の空白が除去されてバリデーションされること", () => {
    const nameWithSpaces = "  香辛料  ";
    const result = validateSeasoningTypeName(nameWithSpaces);
    expect(result).toBe("NONE");
  });

  test("前後の空白を含めて50文字を超える場合でも、trim後が50文字以内ならNONEを返す", () => {
    const nameWithSpaces = "  " + "あ".repeat(50) + "  "; // trim後50文字
    const result = validateSeasoningTypeName(nameWithSpaces);
    expect(result).toBe("NONE");
  });
});
