import { describe, test, expect } from "vitest";
import {
  isValidImageType,
  isValidImageSize,
  validateImage,
} from "./imageValidation";

describe("isValidImageType", () => {
  test("JPEG形式のファイルは有効である", () => {
    const jpegFile = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    expect(isValidImageType(jpegFile)).toBe(true);
  });

  test("PNG形式のファイルは有効である", () => {
    const pngFile = new File(["dummy"], "test.png", { type: "image/png" });
    expect(isValidImageType(pngFile)).toBe(true);
  });

  test("無効なファイル形式は無効である", () => {
    const textFile = new File(["dummy"], "test.txt", { type: "text/plain" });
    expect(isValidImageType(textFile)).toBe(false);
  });
});

describe("isValidImageSize", () => {
  test("5MB以下のファイルは有効である", () => {
    const smallFile = new File(["x".repeat(1024)], "small.jpg", {
      type: "image/jpeg",
    });
    expect(isValidImageSize(smallFile)).toBe(true);
  });

  test("5MBを超えるファイルは無効である", () => {
    // 6MB相当のダミーデータ
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    expect(isValidImageSize(largeFile)).toBe(false);
  });
});

describe("validateImage", () => {
  test("nullファイルは'NONE'を返す", () => {
    expect(validateImage(null)).toBe("NONE");
  });

  test("有効なファイルは'NONE'を返す", () => {
    const validFile = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    expect(validateImage(validFile)).toBe("NONE");
  });

  test("無効なファイル形式はINVALID_TYPEを返す", () => {
    const invalidFile = new File(["dummy"], "test.txt", { type: "text/plain" });
    expect(validateImage(invalidFile)).toBe("INVALID_TYPE");
  });

  test("サイズ超過ファイルはSIZE_EXCEEDEDを返す", () => {
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    expect(validateImage(largeFile)).toBe("SIZE_EXCEEDED");
  });
});
