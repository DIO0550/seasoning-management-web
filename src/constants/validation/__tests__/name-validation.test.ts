import { describe, test, expect } from "vitest";
import {
  SEASONING_NAME_MAX_LENGTH,
  TEMPLATE_NAME_MAX_LENGTH,
  SEASONING_TYPE_NAME_MAX_LENGTH,
  NAME_VALIDATION_CONSTANTS,
} from "../name-validation";

describe("nameValidation constants", () => {
  test("名前バリデーション定数が正しく定義されている", () => {
    expect(SEASONING_NAME_MAX_LENGTH).toBe(256);
    expect(TEMPLATE_NAME_MAX_LENGTH).toBe(256);
    expect(SEASONING_TYPE_NAME_MAX_LENGTH).toBe(256);
  });

  test("NAME_VALIDATION_CONSTANTSオブジェクトが正しく定義されている", () => {
    expect(NAME_VALIDATION_CONSTANTS.SEASONING_NAME_MAX_LENGTH).toBe(256);
    expect(NAME_VALIDATION_CONSTANTS.TEMPLATE_NAME_MAX_LENGTH).toBe(256);
    expect(NAME_VALIDATION_CONSTANTS.SEASONING_TYPE_NAME_MAX_LENGTH).toBe(256);
  });
});
