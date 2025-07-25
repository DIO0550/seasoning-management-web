import { validateSeasoningTypeName } from "@/utils/seasoningTypeNameValidation";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

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
    const longName = "あ".repeat(SEASONING_TYPE_NAME_MAX_LENGTH + 1); // 51文字
    const result = validateSeasoningTypeName(longName);
    expect(result).toBe("LENGTH_EXCEEDED");
  });

  test(`最大文字数ちょうど（${SEASONING_TYPE_NAME_MAX_LENGTH}文字）の場合、NONE を返す`, () => {
    const maxLengthName = "あ".repeat(SEASONING_TYPE_NAME_MAX_LENGTH);
    const result = validateSeasoningTypeName(maxLengthName);
    expect(result).toBe("NONE");
  });

  test("前後の空白が除去されてバリデーションされること", () => {
    const nameWithSpaces = "  香辛料  ";
    const result = validateSeasoningTypeName(nameWithSpaces);
    expect(result).toBe("NONE");
  });

  test(`前後の空白を含めて${SEASONING_TYPE_NAME_MAX_LENGTH}文字を超える場合でも、trim後が${SEASONING_TYPE_NAME_MAX_LENGTH}文字以内ならNONEを返す`, () => {
    const nameWithSpaces =
      "  " + "あ".repeat(SEASONING_TYPE_NAME_MAX_LENGTH) + "  "; // trim後50文字
    const result = validateSeasoningTypeName(nameWithSpaces);
    expect(result).toBe("NONE");
  });
});
