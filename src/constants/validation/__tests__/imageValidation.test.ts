import { describe, test, expect } from "vitest";
import {
  BYTES_PER_KB,
  IMAGE_MAX_SIZE_MB,
  IMAGE_MAX_SIZE_BYTES,
  IMAGE_VALIDATION_CONSTANTS,
} from "../imageValidation";

describe("imageValidation constants", () => {
  test("画像バリデーション定数が正しく定義されている", () => {
    expect(BYTES_PER_KB).toBe(1024);
    expect(IMAGE_MAX_SIZE_MB).toBe(5);
    expect(IMAGE_MAX_SIZE_BYTES).toBe(5 * 1024 * 1024);
  });

  test("MB・バイト変換が正しく計算されている", () => {
    expect(IMAGE_MAX_SIZE_BYTES).toBe(
      IMAGE_MAX_SIZE_MB * BYTES_PER_KB * BYTES_PER_KB
    );
    expect(IMAGE_MAX_SIZE_BYTES).toBe(5242880); // 5MB = 5 * 1024 * 1024 bytes
  });

  test("IMAGE_VALIDATION_CONSTANTSオブジェクトが正しく定義されている", () => {
    expect(IMAGE_VALIDATION_CONSTANTS.BYTES_PER_KB).toBe(1024);
    expect(IMAGE_VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB).toBe(5);
    expect(IMAGE_VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES).toBe(5242880);
  });
});
