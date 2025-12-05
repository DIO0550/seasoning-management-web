import { test, expect } from "vitest";
import {
  templateAddRequestSchema,
  templateAddResponseSchema,
  templateAddDataSchema,
} from "@/types/api/template/add/schemas";

const baseRequest = {
  name: "和食の基本",
  description: "和食に必要な基本的な調味料セット",
  seasoningIds: [1, 2, 3],
};

test("templateAddRequestSchema: description 付きリクエストは成功", () => {
  expect(() => templateAddRequestSchema.parse(baseRequest)).not.toThrow();
});

test("templateAddRequestSchema: description を省略しても成功", () => {
  const payload = { ...baseRequest, description: null };
  expect(() => templateAddRequestSchema.parse(payload)).not.toThrow();
});

test("templateAddRequestSchema: imageId を指定しても成功", () => {
  const payload = { ...baseRequest, imageId: 10 };
  expect(() => templateAddRequestSchema.parse(payload)).not.toThrow();
});

test("templateAddRequestSchema: imageId が数値でない場合は失敗", () => {
  const payload = { ...baseRequest, imageId: "invalid" };
  expect(() => templateAddRequestSchema.parse(payload)).toThrow(
    "画像IDは数値である必要があります"
  );
});

test("templateAddRequestSchema: imageId が0以下の場合は失敗", () => {
  const payload = { ...baseRequest, imageId: 0 };
  expect(() => templateAddRequestSchema.parse(payload)).toThrow(
    "画像IDは1以上である必要があります"
  );
});

test("templateAddRequestSchema: name が空文字だと失敗", () => {
  const payload = { ...baseRequest, name: "" };
  expect(() => templateAddRequestSchema.parse(payload)).toThrow();
});

test("templateAddRequestSchema: seasoningIds が空配列だと失敗", () => {
  const payload = { ...baseRequest, seasoningIds: [] };
  expect(() => templateAddRequestSchema.parse(payload)).toThrow();
});

test("templateAddResponseSchema: 正常レスポンスを受け入れる", () => {
  const payload = {
    data: {
      id: 1,
      name: "和食の基本",
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

  expect(() => templateAddResponseSchema.parse(payload)).not.toThrow();
});

test("templateAddResponseSchema: data が無いと失敗", () => {
  expect(() => templateAddResponseSchema.parse({})).toThrow();
});

test("templateAddDataSchema: 単体データを検証できる", () => {
  const payload = {
    id: 1,
    name: "和食の基本",
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
  };

  expect(() => templateAddDataSchema.parse(payload)).not.toThrow();
});
