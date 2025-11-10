import { expect, test } from "vitest";

import {
  BYTES_PER_KB,
  IMAGE_MAX_SIZE_MB,
} from "@/constants/validation/imageValidation";
import {
  isValidImageSize,
  isValidImageType,
  validateImage,
} from "@/utils/image-validation/image-validation";

const createFile = (sizeBytes: number, type: string) =>
  new File(["x".repeat(sizeBytes)], "file", { type });

test("isValidImageType - JPEG/PNG のみ許可", () => {
  expect(isValidImageType(createFile(BYTES_PER_KB, "image/jpeg"))).toBe(true);
  expect(isValidImageType(createFile(BYTES_PER_KB, "image/png"))).toBe(true);
  expect(isValidImageType(createFile(BYTES_PER_KB, "text/plain"))).toBe(false);
});

test(`${IMAGE_MAX_SIZE_MB}MB を境界に isValidImageSize が判定する`, () => {
  const limitBytes = IMAGE_MAX_SIZE_MB * BYTES_PER_KB * BYTES_PER_KB;
  expect(isValidImageSize(createFile(limitBytes, "image/jpeg"))).toBe(true);
  expect(isValidImageSize(createFile(limitBytes + 1, "image/jpeg"))).toBe(false);
});

const validateCases: Array<{
  name: string;
  file: File | null;
  expected: ReturnType<typeof validateImage>;
}> = [
  { name: "null ファイルは NONE", file: null, expected: "NONE" },
  {
    name: "有効な JPEG は NONE",
    file: createFile(BYTES_PER_KB, "image/jpeg"),
    expected: "NONE",
  },
  {
    name: "無効な拡張子は INVALID_TYPE",
    file: createFile(BYTES_PER_KB, "text/plain"),
    expected: "INVALID_TYPE",
  },
  {
    name: "サイズ超過は SIZE_EXCEEDED",
    file: createFile(
      (IMAGE_MAX_SIZE_MB + 1) * BYTES_PER_KB * BYTES_PER_KB,
      "image/jpeg"
    ),
    expected: "SIZE_EXCEEDED",
  },
];

test.each(validateCases)("validateImage - %s", ({ file, expected }) => {
  expect(validateImage(file)).toBe(expected);
});
