import { describe, test, expect } from "vitest";
import {
  TEMPLATE_DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_VALIDATION_CONSTANTS,
} from "./descriptionValidation";

describe("descriptionValidation constants", () => {
  test("説明バリデーション定数が正しく定義されている", () => {
    expect(TEMPLATE_DESCRIPTION_MAX_LENGTH).toBe(200);
  });

  test("DESCRIPTION_VALIDATION_CONSTANTSオブジェクトが正しく定義されている", () => {
    expect(
      DESCRIPTION_VALIDATION_CONSTANTS.TEMPLATE_DESCRIPTION_MAX_LENGTH
    ).toBe(200);
  });
});
