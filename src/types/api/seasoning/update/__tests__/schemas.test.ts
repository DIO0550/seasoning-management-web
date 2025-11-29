import { test, expect } from "vitest";
import {
  seasoningUpdateRequestSchema,
  seasoningUpdateResponseSchema,
  seasoningUpdateDataSchema,
} from "@/types/api/seasoning/update/schemas";

const validRequestBase = {
  id: 1,
  name: "soysauce",
  seasoningTypeId: 1,
};

test("seasoningUpdateRequestSchema: すべてのフィールドを受け入れる", () => {
  const payload = {
    ...validRequestBase,
    image: null,
    bestBeforeAt: "2024-12-31",
    expiresAt: "2024-11-30",
    purchasedAt: "2024-01-01",
  };

  expect(() => seasoningUpdateRequestSchema.parse(payload)).not.toThrow();
});

test("seasoningUpdateRequestSchema: 必須項目だけでも有効", () => {
  expect(() =>
    seasoningUpdateRequestSchema.parse(validRequestBase)
  ).not.toThrow();
});

test("seasoningUpdateRequestSchema: base64 画像文字列も許可", () => {
  const payload = {
    ...validRequestBase,
    image: "base64encodedimage",
  };

  expect(() => seasoningUpdateRequestSchema.parse(payload)).not.toThrow();
});

test("seasoningUpdateRequestSchema: id 未指定は失敗", () => {
  const payload = {
    name: "soysauce",
    seasoningTypeId: 1,
  };

  expect(() => seasoningUpdateRequestSchema.parse(payload)).toThrow(
    "IDは必須です"
  );
});

test("seasoningUpdateRequestSchema: name が空なら失敗", () => {
  const payload = {
    ...validRequestBase,
    name: "",
  };

  expect(() => seasoningUpdateRequestSchema.parse(payload)).toThrow(
    "調味料名は必須です"
  );
});

test("seasoningUpdateRequestSchema: name が21文字で失敗", () => {
  const payload = {
    ...validRequestBase,
    name: "a".repeat(21),
  };

  expect(() => seasoningUpdateRequestSchema.parse(payload)).toThrow(
    "調味料名は20文字以内で入力してください"
  );
});

test("seasoningUpdateRequestSchema: 不正な日付は失敗", () => {
  const payload = {
    ...validRequestBase,
    bestBeforeAt: "invalid-date",
  };

  expect(() => seasoningUpdateRequestSchema.parse(payload)).toThrow();
});

test("seasoningUpdateResponseSchema: 正常レスポンスを受け入れる", () => {
  const payload = {
    data: {
      id: 1,
      name: "醤油",
      seasoningTypeId: 1,
      seasoningTypeName: "液体調味料",
      imageUrl: null,
      bestBeforeAt: "2024-12-31",
      expiresAt: "2024-11-30",
      purchasedAt: "2024-01-01",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  };

  expect(() => seasoningUpdateResponseSchema.parse(payload)).not.toThrow();
});

test("seasoningUpdateResponseSchema: data が無いと失敗", () => {
  expect(() => seasoningUpdateResponseSchema.parse({})).toThrow();
});

test("seasoningUpdateDataSchema: 単体データの検証ができる", () => {
  const payload = {
    id: 1,
    name: "醤油",
    seasoningTypeId: 1,
    seasoningTypeName: "液体調味料",
    imageUrl: null,
    bestBeforeAt: "2024-12-31",
    expiresAt: "2024-11-30",
    purchasedAt: "2024-01-01",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  expect(() => seasoningUpdateDataSchema.parse(payload)).not.toThrow();
});
