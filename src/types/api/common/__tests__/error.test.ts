import { test, expect } from "vitest";
import {
  errorDetailSchema,
  errorResponseSchema,
} from "@/types/api/common/error";

test("errorResponseSchema: details は任意で追加できる", () => {
  const payload = {
    code: "VALIDATION_ERROR",
    message: "入力内容を確認してください",
    details: [
      errorDetailSchema.parse({ field: "name", message: "必須です" }),
      errorDetailSchema.parse({ message: "共通エラー" }),
    ],
  };

  expect(() => errorResponseSchema.parse(payload)).not.toThrow();
});

test("errorResponseSchema: code が無いとバリデーションエラー", () => {
  expect(() => errorResponseSchema.parse({ message: "NG" })).toThrow();
});

test("errorDetailSchema: field は任意項目", () => {
  expect(() =>
    errorDetailSchema.parse({ message: "エラーメッセージ" })
  ).not.toThrow();
});

test("errorDetailSchema: message は必須", () => {
  expect(() => errorDetailSchema.parse({ field: "name" })).toThrow();
});

test("errorResponseSchema: details が空配列でも有効", () => {
  const payload = {
    code: "VALIDATION_ERROR",
    message: "入力内容を確認してください",
    details: [],
  };

  expect(() => errorResponseSchema.parse(payload)).not.toThrow();
});
