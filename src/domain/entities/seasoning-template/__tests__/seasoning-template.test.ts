/**
 * @fileoverview 調味料テンプレートエンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { test, expect } from "vitest";
import {
  SeasoningTemplate,
  SeasoningTemplateSchema,
} from "../seasoning-template";

test("SeasoningTemplate: 有効なデータでエンティティを生成できる", () => {
  const validSeasoningTemplateData = {
    id: 1,
    name: "和食基本セット",
    typeId: 1,
    imageId: 2,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    const seasoningTemplate = new SeasoningTemplate(validSeasoningTemplateData);
    expect(seasoningTemplate.id).toBe(1);
    expect(seasoningTemplate.name).toBe("和食基本セット");
    expect(seasoningTemplate.typeId).toBe(1);
    expect(seasoningTemplate.imageId).toBe(2);
  }).not.toThrow();
});

test("SeasoningTemplate: imageId が null でも生成できる", () => {
  const validSeasoningTemplateData = {
    id: 1,
    name: "和食基本セット",
    typeId: 1,
    imageId: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    const seasoningTemplate = new SeasoningTemplate(validSeasoningTemplateData);
    expect(seasoningTemplate.imageId).toBe(null);
  }).not.toThrow();
});

test("SeasoningTemplate: name が空文字の場合は生成に失敗する", () => {
  const invalidSeasoningTemplateData = {
    id: 1,
    name: "",
    typeId: 1,
    imageId: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    new SeasoningTemplate(invalidSeasoningTemplateData);
  }).toThrow("name cannot be empty");
});

test("SeasoningTemplateSchema: 有効なデータはバリデーションを通過する", () => {
  const validData = {
    id: 1,
    name: "和食基本セット",
    typeId: 1,
    imageId: 2,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningTemplateSchema.parse(validData);
  }).not.toThrow();
});

test("SeasoningTemplateSchema: typeId が 0 の場合はバリデーションエラー", () => {
  const invalidData = {
    id: 1,
    name: "和食基本セット",
    typeId: 0,
    imageId: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningTemplateSchema.parse(invalidData);
  }).toThrow();
});
