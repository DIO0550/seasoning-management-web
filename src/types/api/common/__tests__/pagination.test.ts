import { test, expect } from "vitest";
import { paginationSchema } from "@/types/api/common/pagination";

test("paginationSchema: 正常値は通過する", () => {
  const payload = {
    page: 1,
    pageSize: 20,
    totalItems: 100,
    totalPages: 5,
    hasNext: true,
    hasPrevious: false,
  };

  expect(() => paginationSchema.parse(payload)).not.toThrow();
});

test("paginationSchema: page が1未満なら失敗する", () => {
  expect(() =>
    paginationSchema.parse({
      page: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    })
  ).toThrow();
});

test("paginationSchema: pageSize が1未満なら失敗する", () => {
  expect(() =>
    paginationSchema.parse({
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    })
  ).toThrow();
});

test("paginationSchema: totalItems が負の値なら失敗する", () => {
  expect(() =>
    paginationSchema.parse({
      page: 1,
      pageSize: 10,
      totalItems: -1,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    })
  ).toThrow();
});

test("paginationSchema: totalPages が負の値なら失敗する", () => {
  expect(() =>
    paginationSchema.parse({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: -1,
      hasNext: false,
      hasPrevious: false,
    })
  ).toThrow();
});

test("paginationSchema: hasNext が boolean でない場合は失敗する", () => {
  expect(() =>
    paginationSchema.parse({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: "true",
      hasPrevious: false,
    })
  ).toThrow();
});

test("paginationSchema: hasPrevious が boolean でない場合は失敗する", () => {
  expect(() =>
    paginationSchema.parse({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: "false",
    })
  ).toThrow();
});
