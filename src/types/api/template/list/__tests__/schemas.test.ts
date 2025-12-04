import { test, expect } from "vitest";
import {
  templateListResponseSchema,
  templateListQuerySchema,
} from "@/types/api/template/list/schemas";

const baseQuery = {
  page: 1,
  pageSize: 20,
  search: null,
};

test("templateListQuerySchema: 基本的なクエリを受け入れる", () => {
  expect(() => templateListQuerySchema.parse(baseQuery)).not.toThrow();
});

test("templateListQuerySchema: search ありでも有効", () => {
  const payload = { ...baseQuery, page: 2, pageSize: 10, search: "和食" };
  expect(() => templateListQuerySchema.parse(payload)).not.toThrow();
});

test("templateListQuerySchema: pageSize が100を超えると失敗", () => {
  const payload = { ...baseQuery, pageSize: 101 };
  expect(() => templateListQuerySchema.parse(payload)).toThrow();
});

const baseResponse = {
  data: [
    {
      id: 1,
      name: "和食の基本",
      description: "和食に必要な基本的な調味料セット",
      seasoningCount: 3,
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
  ],
  meta: {
    page: 1,
    pageSize: 20,
    totalItems: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

test("templateListResponseSchema: 正常レスポンスを受け入れる", () => {
  expect(() => templateListResponseSchema.parse(baseResponse)).not.toThrow();
});

test("templateListResponseSchema: data が無いと失敗", () => {
  expect(() => templateListResponseSchema.parse({})).toThrow();
});
