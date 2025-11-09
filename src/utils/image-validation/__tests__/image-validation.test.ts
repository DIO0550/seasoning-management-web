import { describe, test, expect } from "vitest";
import {
  isValidImageType,
  isValidImageSize,
  validateImage,
} from "@/utils/image-validation/image-validation";
import {
  IMAGE_MAX_SIZE_MB,
  BYTES_PER_KB,
} from "@/constants/validation/imageValidation";

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
  test(`${IMAGE_MAX_SIZE_MB}MB以下のファイルは有効である`, () => {
    const smallFile = new File(["x".repeat(BYTES_PER_KB)], "small.jpg", {
      type: "image/jpeg",
    });
    expect(isValidImageSize(smallFile)).toBe(true);
  });

  test(`${IMAGE_MAX_SIZE_MB}MBを超えるファイルは無効である`, () => {
    // 6MB相当のダミーデータ
    const largeFile = new File(
      ["x".repeat((IMAGE_MAX_SIZE_MB + 1) * BYTES_PER_KB * BYTES_PER_KB)],
      "large.jpg",
      {
        type: "image/jpeg",
      }
    );
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
