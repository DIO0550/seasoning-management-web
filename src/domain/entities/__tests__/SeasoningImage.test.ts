/**
 * @fileoverview 調味料画像エンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { test, expect } from "vitest";
import { SeasoningImage, SeasoningImageSchema } from "../SeasoningImage";

test("SeasoningImage: 有効なデータでエンティティを生成できる", () => {
  const validSeasoningImageData = {
    id: 1,
    folderUuid: "123e4567-e89b-12d3-a456-426614174000",
    filename: "image.jpg",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    const seasoningImage = new SeasoningImage(validSeasoningImageData);
    expect(seasoningImage.id).toBe(1);
    expect(seasoningImage.folderUuid).toBe(
      "123e4567-e89b-12d3-a456-426614174000"
    );
    expect(seasoningImage.filename).toBe("image.jpg");
  }).not.toThrow();
});

test("SeasoningImage: folderUuid が不正な形式の場合は生成に失敗する", () => {
  const invalidSeasoningImageData = {
    id: 1,
    folderUuid: "invalid-uuid",
    filename: "image.jpg",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    new SeasoningImage(invalidSeasoningImageData);
  }).toThrow("folderUuid must be a valid UUID");
});

test("SeasoningImage: filename が空文字の場合は生成に失敗する", () => {
  const invalidSeasoningImageData = {
    id: 1,
    folderUuid: "123e4567-e89b-12d3-a456-426614174000",
    filename: "",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    new SeasoningImage(invalidSeasoningImageData);
  }).toThrow("filename cannot be empty");
});

test("SeasoningImageSchema: 有効なデータはバリデーションを通過する", () => {
  const validData = {
    id: 1,
    folderUuid: "123e4567-e89b-12d3-a456-426614174000",
    filename: "image.jpg",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningImageSchema.parse(validData);
  }).not.toThrow();
});

test("SeasoningImageSchema: UUID が不正な場合はバリデーションエラー", () => {
  const invalidData = {
    id: 1,
    folderUuid: "not-a-uuid",
    filename: "image.jpg",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningImageSchema.parse(invalidData);
  }).toThrow();
});
