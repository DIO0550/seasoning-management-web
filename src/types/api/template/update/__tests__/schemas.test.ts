import { test, expect } from "vitest";
import {
  templateUpdateRequestSchema,
  templateUpdateResponseSchema,
  templateUpdateDataSchema,
} from "@/types/api/template/update/schemas";

const baseRequest = {
  id: 1,
  name: "朝食セット",
  description: "朝食に使う調味料セット",
  seasoningIds: [1, 2, 3],
};

test("templateUpdateRequestSchema: 全フィールドを受け入れる", () => {
  expect(() => templateUpdateRequestSchema.parse(baseRequest)).not.toThrow();
});

test("templateUpdateRequestSchema: description を省略しても成功", () => {
  const payload = { ...baseRequest, description: null };
  expect(() => templateUpdateRequestSchema.parse(payload)).not.toThrow();
});

test("templateUpdateRequestSchema: seasoningIds が空配列なら失敗", () => {
  const payload = { ...baseRequest, seasoningIds: [] };
  expect(() => templateUpdateRequestSchema.parse(payload)).toThrow(
    "少なくとも1つの調味料を選択してください"
  );
});

test("templateUpdateRequestSchema: name が空文字なら失敗", () => {
  const payload = { ...baseRequest, name: "" };
  expect(() => templateUpdateRequestSchema.parse(payload)).toThrow(
    "テンプレート名は必須です"
  );
});

const baseResponse = {
  data: {
    id: 1,
    name: "朝食セット",
    description: baseRequest.description,
    imageId: null,
    imageUrl: null,
    seasonings: [
      {
        id: 1,
        name: "醤油",
        seasoningTypeId: 1,
        seasoningTypeName: "液体調味料",
        imageUrl: null,
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
};

test("templateUpdateResponseSchema: 正常レスポンスを受け入れる", () => {
  expect(() => templateUpdateResponseSchema.parse(baseResponse)).not.toThrow();
});

test("templateUpdateResponseSchema: data が無いと失敗", () => {
  expect(() => templateUpdateResponseSchema.parse({})).toThrow();
});

test("templateUpdateDataSchema: 単体データを検証できる", () => {
  expect(() => templateUpdateDataSchema.parse(baseResponse.data)).not.toThrow();
});
