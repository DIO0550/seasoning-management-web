/**
 * @fileoverview 調味料エンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { test, expect } from "vitest";
import { Seasoning, SeasoningSchema } from "../seasoning";

test("Seasoning: 有効なデータでエンティティを生成できる", () => {
  const validSeasoningData = {
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    const seasoning = new Seasoning(validSeasoningData);
    expect(seasoning.id).toBe(1);
    expect(seasoning.name).toBe("醤油");
    expect(seasoning.typeId).toBe(1);
  }).not.toThrow();
});

test("Seasoning: name が空文字の場合は生成に失敗する", () => {
  const invalidSeasoningData = {
    id: 1,
    name: "",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    new Seasoning(invalidSeasoningData);
  }).toThrow("name cannot be empty");
});

test("SeasoningSchema: 有効なデータはバリデーションを通過する", () => {
  const validData = {
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningSchema.parse(validData);
  }).not.toThrow();
});

test("SeasoningSchema: name が文字列でない場合はバリデーションエラー", () => {
  const invalidData = {
    id: 1,
    name: 123,
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningSchema.parse(invalidData);
  }).toThrow();
});
