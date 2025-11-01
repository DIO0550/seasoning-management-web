import { describe, test, expect } from "vitest";
import {
  VALIDATION_ERROR_MESSAGES,
  VALIDATION_CONSTANTS,
} from "@/constants/validation";

describe("validation constants", () => {
  describe("VALIDATION_ERROR_MESSAGES (ネストされた構造)", () => {
    describe("IMAGE カテゴリ", () => {
      test("INVALID_TYPE が文字列として定義されている", () => {
        expect(typeof VALIDATION_ERROR_MESSAGES.IMAGE.INVALID_TYPE).toBe(
          "string"
        );
        expect(VALIDATION_ERROR_MESSAGES.IMAGE.INVALID_TYPE).toBe(
          "JPEG、PNG 形式のファイルを選択してください"
        );
      });

      test("SIZE_EXCEEDED が関数として定義されている", () => {
        expect(typeof VALIDATION_ERROR_MESSAGES.IMAGE.SIZE_EXCEEDED).toBe(
          "function"
        );
        const message = VALIDATION_ERROR_MESSAGES.IMAGE.SIZE_EXCEEDED(5);
        expect(message).toBe("ファイルサイズは 5MB 以下にしてください");
      });
    });

    describe("NAME カテゴリ", () => {
      test("REQUIRED が文字列として定義されている", () => {
        expect(typeof VALIDATION_ERROR_MESSAGES.NAME.REQUIRED).toBe("string");
        expect(VALIDATION_ERROR_MESSAGES.NAME.REQUIRED).toBe(
          "調味料名は必須です"
        );
      });

      test("INVALID_FORMAT が文字列として定義されている", () => {
        expect(typeof VALIDATION_ERROR_MESSAGES.NAME.INVALID_FORMAT).toBe(
          "string"
        );
        expect(VALIDATION_ERROR_MESSAGES.NAME.INVALID_FORMAT).toBe(
          "調味料名は半角英数字で入力してください"
        );
      });

      test("LENGTH_EXCEEDED が関数として定義されている", () => {
        expect(typeof VALIDATION_ERROR_MESSAGES.NAME.LENGTH_EXCEEDED).toBe(
          "function"
        );
        const message = VALIDATION_ERROR_MESSAGES.NAME.LENGTH_EXCEEDED(20);
        expect(message).toBe("調味料名は 20 文字以内で入力してください");
      });
    });

    describe("SEASONING カテゴリ", () => {
      test("SUBMIT_ERROR が文字列として定義されている", () => {
        expect(typeof VALIDATION_ERROR_MESSAGES.SEASONING.SUBMIT_ERROR).toBe(
          "string"
        );
        expect(VALIDATION_ERROR_MESSAGES.SEASONING.SUBMIT_ERROR).toBe(
          "調味料の登録に失敗しました。入力内容を確認してください"
        );
      });
    });
  });

  describe("VALIDATION_CONSTANTS", () => {
    test("定数が適切に定義されている", () => {
      expect(VALIDATION_CONSTANTS.NAME_MAX_LENGTH).toBe(20);
      expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB).toBe(5);
      expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES).toBe(5 * 1024 * 1024);
      expect(VALIDATION_CONSTANTS.IMAGE_VALID_TYPES).toEqual([
        "image/jpeg",
        "image/png",
      ]);
    });
  });

  describe("VALIDATION_CONSTANTS 統合構造", () => {
    describe("新しい構造の検証", () => {
      test("すべてのカテゴリが含まれている", () => {
        expect(VALIDATION_CONSTANTS).toHaveProperty("NAME");
        expect(VALIDATION_CONSTANTS).toHaveProperty("DESCRIPTION");
        expect(VALIDATION_CONSTANTS).toHaveProperty("IMAGE");
      });

      test("NAME カテゴリに必要な定数が含まれている", () => {
        expect(VALIDATION_CONSTANTS.NAME).toHaveProperty(
          "SEASONING_NAME_MAX_LENGTH"
        );
        expect(VALIDATION_CONSTANTS.NAME).toHaveProperty(
          "TEMPLATE_NAME_MAX_LENGTH"
        );
        expect(VALIDATION_CONSTANTS.NAME).toHaveProperty(
          "SEASONING_TYPE_NAME_MAX_LENGTH"
        );
      });

      test("DESCRIPTION カテゴリに必要な定数が含まれている", () => {
        expect(VALIDATION_CONSTANTS.DESCRIPTION).toHaveProperty(
          "TEMPLATE_DESCRIPTION_MAX_LENGTH"
        );
      });

      test("IMAGE カテゴリに必要な定数が含まれている", () => {
        expect(VALIDATION_CONSTANTS.IMAGE).toHaveProperty("BYTES_PER_KB");
        expect(VALIDATION_CONSTANTS.IMAGE).toHaveProperty("IMAGE_MAX_SIZE_MB");
        expect(VALIDATION_CONSTANTS.IMAGE).toHaveProperty(
          "IMAGE_MAX_SIZE_BYTES"
        );
        expect(VALIDATION_CONSTANTS.IMAGE).toHaveProperty("VALID_TYPES");
      });
    });

    describe("後方互換性の検証", () => {
      test("非推奨定数が正しい値を持っている", () => {
        expect(VALIDATION_CONSTANTS.NAME_MAX_LENGTH).toBe(20);
        expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES).toBe(5242880);
        expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB).toBe(5);
        expect(VALIDATION_CONSTANTS.IMAGE_VALID_TYPES).toEqual([
          "image/jpeg",
          "image/png",
        ]);
      });

      test("新しい構造と後方互換性の値が一致している", () => {
        expect(VALIDATION_CONSTANTS.NAME_MAX_LENGTH).toBe(
          VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH
        );
        expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_BYTES).toBe(
          VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_BYTES
        );
        expect(VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB).toBe(
          VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_MB
        );
      });
    });
  });
});
