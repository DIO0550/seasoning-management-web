import { expect, test } from "vitest";
import {
  VALIDATION_CONSTANTS,
  VALIDATION_ERROR_MESSAGES,
} from "@/constants/validation";

test("名前系定数が正しく統合されている", () => {
  expect(VALIDATION_CONSTANTS.NAME).toBeDefined();
  expect(VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH).toBe(256);
  expect(VALIDATION_CONSTANTS.NAME.SEASONING_PURCHASE_NAME_MAX_LENGTH).toBe(100);
  expect(VALIDATION_CONSTANTS.NAME.TEMPLATE_NAME_MAX_LENGTH).toBe(256);
  expect(VALIDATION_CONSTANTS.NAME.SEASONING_TYPE_NAME_MAX_LENGTH).toBe(50);
});

test("説明系定数が正しく統合されている", () => {
  expect(VALIDATION_CONSTANTS.DESCRIPTION).toBeDefined();
  expect(VALIDATION_CONSTANTS.DESCRIPTION.TEMPLATE_DESCRIPTION_MAX_LENGTH).toBe(
    200
  );
});

test("画像系定数が正しく統合されている", () => {
  expect(VALIDATION_CONSTANTS.IMAGE).toBeDefined();
  expect(VALIDATION_CONSTANTS.IMAGE.BYTES_PER_KB).toBe(1024);
  expect(VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_MB).toBe(5);
  expect(VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_BYTES).toBe(5242880);
  expect(VALIDATION_CONSTANTS.IMAGE.VALID_TYPES).toEqual([
    "image/jpeg",
    "image/png",
  ]);
});

test("後方互換性のための定数が正しく設定されている", () => {
  expect(VALIDATION_CONSTANTS.NAME_MAX_LENGTH).toBe(256);
  expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES).toBe(5242880);
  expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB).toBe(5);
  expect(VALIDATION_CONSTANTS.IMAGE_VALID_TYPES).toEqual([
    "image/jpeg",
    "image/png",
  ]);
});

test("画像関連エラーメッセージが正しく定義されている", () => {
  expect(VALIDATION_ERROR_MESSAGES.IMAGE.INVALID_TYPE).toBe(
    "JPEG、PNG 形式のファイルを選択してください"
  );
  expect(VALIDATION_ERROR_MESSAGES.IMAGE.SIZE_EXCEEDED(5)).toBe(
    "ファイルサイズは 5MB 以下にしてください"
  );
});

test("名前関連エラーメッセージが正しく定義されている", () => {
  expect(VALIDATION_ERROR_MESSAGES.NAME.REQUIRED).toBe("調味料名は必須です");
  expect(VALIDATION_ERROR_MESSAGES.NAME.INVALID_FORMAT).toBe(
    "調味料名は半角英数字で入力してください"
  );
  expect(VALIDATION_ERROR_MESSAGES.NAME.LENGTH_EXCEEDED(20)).toBe(
    "調味料名は 20 文字以内で入力してください"
  );
});

test("調味料関連エラーメッセージが正しく定義されている", () => {
  expect(VALIDATION_ERROR_MESSAGES.SEASONING.SUBMIT_ERROR).toBe(
    "調味料の登録に失敗しました。入力内容を確認してください"
  );
});

test("後方互換性のある定数が正しく参照されている", () => {
  expect(VALIDATION_CONSTANTS.NAME_MAX_LENGTH).toBe(
    VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH
  );
  expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB).toBe(
    VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_MB
  );
  expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES).toBe(
    VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_BYTES
  );
});
