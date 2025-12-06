import { test, expect } from "vitest";
import {
  templateDeleteRequestSchema,
  templateDeleteResponseSchema,
  templateDeleteDataSchema,
} from "@/types/api/template/delete/schemas";

test("templateDeleteRequestSchema: 正常リクエストを受け入れる", () => {
  expect(() => templateDeleteRequestSchema.parse({ id: 1 })).not.toThrow();
});

test("templateDeleteRequestSchema: id 未指定は失敗", () => {
  expect(() => templateDeleteRequestSchema.parse({})).toThrow("IDは必須です");
});

test("templateDeleteRequestSchema: id が0だと失敗", () => {
  expect(() => templateDeleteRequestSchema.parse({ id: 0 })).toThrow(
    "IDは正の整数である必要があります"
  );
});

const baseResponse = {
  data: {
    id: 1,
    deletedAt: "2024-01-01T00:00:00Z",
  },
};

test("templateDeleteResponseSchema: 正常レスポンスを受け入れる", () => {
  expect(() => templateDeleteResponseSchema.parse(baseResponse)).not.toThrow();
});

test("templateDeleteResponseSchema: data が無いと失敗", () => {
  expect(() => templateDeleteResponseSchema.parse({})).toThrow();
});

test("templateDeleteResponseSchema: deletedAt が不正だと失敗", () => {
  const payload = {
    data: {
      id: 1,
      deletedAt: "invalid-datetime",
    },
  };

  expect(() => templateDeleteResponseSchema.parse(payload)).toThrow();
});

test("templateDeleteDataSchema: 単体データを検証できる", () => {
  expect(() => templateDeleteDataSchema.parse(baseResponse.data)).not.toThrow();
});
