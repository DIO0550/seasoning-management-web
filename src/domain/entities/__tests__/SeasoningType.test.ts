/**
 * @fileoverview 調味料種類エンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { test, expect } from "vitest";
import { SeasoningType, SeasoningTypeSchema } from "../SeasoningType";

test("SeasoningType: 有効なデータでエンティティを生成できる", () => {
  const validSeasoningTypeData = {
    id: 1,
    name: "液体調味料",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    const seasoningType = new SeasoningType(validSeasoningTypeData);
    expect(seasoningType.id).toBe(1);
    expect(seasoningType.name).toBe("液体調味料");
  }).not.toThrow();
});

test("SeasoningType: name が空文字の場合はエンティティ生成に失敗する", () => {
  const invalidSeasoningTypeData = {
    id: 1,
    name: "",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    new SeasoningType(invalidSeasoningTypeData);
  }).toThrow("name cannot be empty");
});

test("SeasoningTypeSchema: 有効なデータはバリデーションを通過する", () => {
  const validData = {
    id: 1,
    name: "液体調味料",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningTypeSchema.parse(validData);
  }).not.toThrow();
});

test("SeasoningTypeSchema: id が負数の場合はバリデーションエラーになる", () => {
  const invalidData = {
    id: -1,
    name: "液体調味料",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningTypeSchema.parse(invalidData);
  }).toThrow();
});
