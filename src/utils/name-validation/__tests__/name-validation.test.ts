import { validateSeasoningName } from "@/utils/name-validation/name-validation";
import { SEASONING_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

describe("validateSeasoningName", () => {
  test("空の文字列の場合、REQUIRED エラーを返す", () => {
    const result = validateSeasoningName("");
    expect(result).toBe("REQUIRED");
  });

  test("有効な半角英数字の場合、NONE を返す", () => {
    const result = validateSeasoningName("salt123");
    expect(result).toBe("NONE");
  });

  test("最大文字数を超えた場合、LENGTH_EXCEEDED エラーを返す", () => {
    const longName = "a".repeat(SEASONING_NAME_MAX_LENGTH + 1); // 21文字
    const result = validateSeasoningName(longName);
    expect(result).toBe("LENGTH_EXCEEDED");
  });

  test("半角英数字以外が含まれる場合、INVALID_FORMAT エラーを返す", () => {
    const result = validateSeasoningName("塩123");
    expect(result).toBe("INVALID_FORMAT");
  });

  test("記号が含まれる場合、INVALID_FORMAT エラーを返す", () => {
    const result = validateSeasoningName("salt-123");
    expect(result).toBe("INVALID_FORMAT");
  });

  test(`最大文字数ちょうど（${SEASONING_NAME_MAX_LENGTH}文字）の場合、NONE を返す`, () => {
    const maxLengthName = "a".repeat(SEASONING_NAME_MAX_LENGTH);
    const result = validateSeasoningName(maxLengthName);
    expect(result).toBe("NONE");
  });
});
