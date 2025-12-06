import { test, expect } from "vitest";
import { z } from "zod";
import {
  paginatedResponseSchema,
  successResponseSchema,
} from "@/types/api/common/response";

test("successResponseSchema: data フィールドを必須にする", () => {
  const schema = successResponseSchema(z.object({ id: z.number() }));

  expect(() => schema.parse({ data: { id: 1 } })).not.toThrow();
  expect(() => schema.parse({})).toThrow();
});

test("paginatedResponseSchema: summary を含むレスポンスを検証する", () => {
  const schema = paginatedResponseSchema(z.object({ id: z.number() }), {
    summarySchema: z.object({ totalCount: z.number().int().min(0) }),
  });

  expect(() =>
    schema.parse({
      data: [{ id: 1 }],
      meta: {
        page: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
      summary: { totalCount: 1 },
    })
  ).not.toThrow();
});

test("paginatedResponseSchema: summary なしのレスポンスを検証する", () => {
  const schema = paginatedResponseSchema(z.object({ name: z.string() }));

  expect(() =>
    schema.parse({
      data: [{ name: "テスト" }],
      meta: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    })
  ).not.toThrow();
});

test("paginatedResponseSchema: meta が不正な場合は失敗する", () => {
  const schema = paginatedResponseSchema(z.object({ id: z.number() }));

  expect(() =>
    schema.parse({
      data: [{ id: 1 }],
      meta: { page: 0 },
    })
  ).toThrow();
});
