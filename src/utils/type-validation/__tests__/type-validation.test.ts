import { describe, test, expect } from "vitest";
import { validateType } from "@/utils/type-validation/type-validation";

describe("validateType", () => {
  test("空文字の場合にREQUIREDエラーを返す", () => {
    const result = validateType("");
    expect(result).toBe("REQUIRED");
  });

  test("有効な値の場合にNONEを返す", () => {
    const result = validateType("salt");
    expect(result).toBe("NONE");
  });

  test("空白文字のみの場合にREQUIREDエラーを返す", () => {
    const result = validateType("   ");
    expect(result).toBe("REQUIRED");
  });

  test("前後に空白がある有効な値の場合にNONEを返す", () => {
    const result = validateType("  pepper  ");
    expect(result).toBe("NONE");
  });
});
