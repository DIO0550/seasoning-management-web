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
