/**
 * @fileoverview 調味料画像エンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect } from "vitest";
import { SeasoningImage, SeasoningImageSchema } from "./SeasoningImage";

describe("SeasoningImage Entity", () => {
  describe("エンティティの作成", () => {
    test("有効なデータでSeasoningImageエンティティを作成できる", () => {
      // Arrange
      const validSeasoningImageData = {
        id: 1,
        folderUuid: "123e4567-e89b-12d3-a456-426614174000",
        filename: "image.jpg",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        const seasoningImage = new SeasoningImage(validSeasoningImageData);
        expect(seasoningImage.id).toBe(1);
        expect(seasoningImage.folderUuid).toBe(
          "123e4567-e89b-12d3-a456-426614174000"
        );
        expect(seasoningImage.filename).toBe("image.jpg");
      }).not.toThrow();
    });

    test("folderUuidが無効な形式の場合はエラーが発生する", () => {
      // Arrange
      const invalidSeasoningImageData = {
        id: 1,
        folderUuid: "invalid-uuid",
        filename: "image.jpg",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        new SeasoningImage(invalidSeasoningImageData);
      }).toThrow("folderUuid must be a valid UUID");
    });

    test("filenameが空文字の場合はエラーが発生する", () => {
      // Arrange
      const invalidSeasoningImageData = {
        id: 1,
        folderUuid: "123e4567-e89b-12d3-a456-426614174000",
        filename: "",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        new SeasoningImage(invalidSeasoningImageData);
      }).toThrow("filename cannot be empty");
    });
  });

  describe("Zodスキーマによるバリデーション", () => {
    test("有効なデータはZodスキーマのバリデーションを通過する", () => {
      // Arrange
      const validData = {
        id: 1,
        folderUuid: "123e4567-e89b-12d3-a456-426614174000",
        filename: "image.jpg",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        SeasoningImageSchema.parse(validData);
      }).not.toThrow();
    });

    test("無効なUUID形式の場合はZodバリデーションエラーが発生する", () => {
      // Arrange
      const invalidData = {
        id: 1,
        folderUuid: "not-a-uuid",
        filename: "image.jpg",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        SeasoningImageSchema.parse(invalidData);
      }).toThrow();
    });
  });
});
