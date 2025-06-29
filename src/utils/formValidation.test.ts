import { describe, test, expect } from "vitest";
import {
  hasAllRequiredFields,
  hasAnyFormErrors,
  canSubmit,
  type FormField,
  type FormErrors,
} from "./formValidation";

describe("formValidation utils (モックなし)", () => {
  describe("hasAllRequiredFields", () => {
    test("すべてのフィールドに値がある場合、trueを返す", () => {
      const fields: FormField[] = [
        { value: "salt", error: "" },
        { value: "seasoning", error: "" },
      ];

      expect(hasAllRequiredFields(fields)).toBe(true);
    });

    test("いずれかのフィールドが空の場合、falseを返す", () => {
      const fields: FormField[] = [
        { value: "", error: "" },
        { value: "seasoning", error: "" },
      ];

      expect(hasAllRequiredFields(fields)).toBe(false);
    });

    test("すべてのフィールドが空の場合、falseを返す", () => {
      const fields: FormField[] = [
        { value: "", error: "" },
        { value: "", error: "" },
      ];

      expect(hasAllRequiredFields(fields)).toBe(false);
    });

    test("空の配列の場合、trueを返す", () => {
      const fields: FormField[] = [];

      expect(hasAllRequiredFields(fields)).toBe(true);
    });
  });

  describe("hasAnyFormErrors", () => {
    test("すべてのエラーがない場合、falseを返す", () => {
      const fields: FormField[] = [
        { value: "salt", error: "" },
        { value: "seasoning", error: "" },
      ];
      const errors: FormErrors = { image: "", general: "" };

      expect(hasAnyFormErrors(fields, errors)).toBe(false);
    });

    test("フィールドエラーがある場合、trueを返す", () => {
      const fields: FormField[] = [
        { value: "salt", error: "名前エラー" },
        { value: "seasoning", error: "" },
      ];
      const errors: FormErrors = { image: "", general: "" };

      expect(hasAnyFormErrors(fields, errors)).toBe(true);
    });

    test("画像エラーがある場合、trueを返す", () => {
      const fields: FormField[] = [
        { value: "salt", error: "" },
        { value: "seasoning", error: "" },
      ];
      const errors: FormErrors = { image: "画像エラー", general: "" };

      expect(hasAnyFormErrors(fields, errors)).toBe(true);
    });

    test("一般エラーがある場合、trueを返す", () => {
      const fields: FormField[] = [
        { value: "salt", error: "" },
        { value: "seasoning", error: "" },
      ];
      const errors: FormErrors = { image: "", general: "送信エラー" };

      expect(hasAnyFormErrors(fields, errors)).toBe(true);
    });
  });

  describe("canSubmit", () => {
    test("必須フィールドがあり、エラーがない場合、trueを返す", () => {
      const fields: FormField[] = [
        { value: "salt", error: "" },
        { value: "seasoning", error: "" },
      ];
      const errors: FormErrors = { image: "", general: "" };

      expect(canSubmit(fields, errors)).toBe(true);
    });

    test("必須フィールドが空の場合、falseを返す", () => {
      const fields: FormField[] = [
        { value: "", error: "" },
        { value: "seasoning", error: "" },
      ];
      const errors: FormErrors = { image: "", general: "" };

      expect(canSubmit(fields, errors)).toBe(false);
    });

    test("エラーがある場合、falseを返す", () => {
      const fields: FormField[] = [
        { value: "salt", error: "名前エラー" },
        { value: "seasoning", error: "" },
      ];
      const errors: FormErrors = { image: "", general: "" };

      expect(canSubmit(fields, errors)).toBe(false);
    });

    test("必須フィールドが空でエラーもある場合、falseを返す", () => {
      const fields: FormField[] = [
        { value: "", error: "名前エラー" },
        { value: "", error: "" },
      ];
      const errors: FormErrors = { image: "画像エラー", general: "" };

      expect(canSubmit(fields, errors)).toBe(false);
    });
  });
});
