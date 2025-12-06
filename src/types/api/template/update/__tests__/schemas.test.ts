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

test("templateUpdateRequestSchema: imageId を指定しても成功", () => {
  const payload = { ...baseRequest, imageId: 10 };
  expect(() => templateUpdateRequestSchema.parse(payload)).not.toThrow();
});

test("templateUpdateRequestSchema: imageId が数値でない場合は失敗", () => {
  const payload = { ...baseRequest, imageId: "invalid" };
  expect(() => templateUpdateRequestSchema.parse(payload)).toThrow(
    "画像IDは数値である必要があります"
  );
});

test("templateUpdateRequestSchema: imageId が0以下の場合は失敗", () => {
  const payload = { ...baseRequest, imageId: 0 };
  expect(() => templateUpdateRequestSchema.parse(payload)).toThrow(
    "画像IDは1以上である必要があります"
  );
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

test("templateUpdateRequestSchema: name が100文字を超えると失敗", () => {
  const payload = { ...baseRequest, name: "a".repeat(101) };
  expect(() => templateUpdateRequestSchema.parse(payload)).toThrow(
    "テンプレート名は100文字以内で入力してください"
  );
});

test("templateUpdateRequestSchema: description が500文字を超えると失敗", () => {
  const payload = { ...baseRequest, description: "a".repeat(501) };
  expect(() => templateUpdateRequestSchema.parse(payload)).toThrow(
    "説明は500文字以内で入力してください"
  );
});

test("templateUpdateRequestSchema: seasoningIds に不正な値が含まれると失敗", () => {
  const payload = { ...baseRequest, seasoningIds: [1, 0, 3] };
  expect(() => templateUpdateRequestSchema.parse(payload)).toThrow();
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
        imageId: null,
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

test("templateUpdateResponseSchema: description が null でも成功", () => {
  const payload = {
    data: {
      ...baseResponse.data,
      description: null,
    },
  };
  expect(() => templateUpdateResponseSchema.parse(payload)).not.toThrow();
});

test("templateUpdateResponseSchema: data が無いと失敗", () => {
  expect(() => templateUpdateResponseSchema.parse({})).toThrow();
});

test("templateUpdateDataSchema: 単体データを検証できる", () => {
  expect(() => templateUpdateDataSchema.parse(baseResponse.data)).not.toThrow();
});
