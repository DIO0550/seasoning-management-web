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
  imageId: null,
};

test("seasoningUpdateRequestSchema: すべてのフィールドを受け入れる", () => {
  const payload = {
    ...validRequestBase,
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

test("seasoningUpdateRequestSchema: imageId を指定しても有効", () => {
  const payload = {
    ...validRequestBase,
    imageId: 10,
  };

  expect(() => seasoningUpdateRequestSchema.parse(payload)).not.toThrow();
});

test("seasoningUpdateRequestSchema: imageId が数値でない場合は失敗", () => {
  const payload = {
    ...validRequestBase,
    imageId: "invalid",
  };
  expect(() => seasoningUpdateRequestSchema.parse(payload)).toThrow(
    "画像IDは数値である必要があります"
  );
});

test("seasoningUpdateRequestSchema: imageId が0以下の場合は失敗", () => {
  const payload = {
    ...validRequestBase,
    imageId: 0,
  };
  expect(() => seasoningUpdateRequestSchema.parse(payload)).toThrow(
    "画像IDは1以上である必要があります"
  );
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
      imageId: null,
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
    imageId: null,
    imageUrl: null,
    bestBeforeAt: "2024-12-31",
    expiresAt: "2024-11-30",
    purchasedAt: "2024-01-01",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  expect(() => seasoningUpdateDataSchema.parse(payload)).not.toThrow();
});

