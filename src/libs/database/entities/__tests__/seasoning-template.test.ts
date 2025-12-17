/**
 * @fileoverview 調味料テンプレートエンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect } from "vitest";
import {
  SeasoningTemplate,
  SeasoningTemplateSchema,
} from "../seasoning-template";

describe("SeasoningTemplate Entity", () => {
  describe("エンティティの作成", () => {
    test("有効なデータでSeasoningTemplateエンティティを作成できる", () => {
      // Arrange
      const validSeasoningTemplateData = {
        id: 1,
        name: "和食基本セット",
        typeId: 1,
        imageId: 2,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        const seasoningTemplate = new SeasoningTemplate(
          validSeasoningTemplateData
        );
        expect(seasoningTemplate.id).toBe(1);
        expect(seasoningTemplate.name).toBe("和食基本セット");
        expect(seasoningTemplate.typeId).toBe(1);
        expect(seasoningTemplate.imageId).toBe(2);
      }).not.toThrow();
    });

    test("imageIdがnullでも作成できる", () => {
      // Arrange
      const validSeasoningTemplateData = {
        id: 1,
        name: "和食基本セット",
        typeId: 1,
        imageId: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        const seasoningTemplate = new SeasoningTemplate(
          validSeasoningTemplateData
        );
        expect(seasoningTemplate.imageId).toBe(null);
      }).not.toThrow();
    });

    test("nameが空文字の場合はエラーが発生する", () => {
      // Arrange
      const invalidSeasoningTemplateData = {
        id: 1,
        name: "",
        typeId: 1,
        imageId: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        new SeasoningTemplate(invalidSeasoningTemplateData);
      }).toThrow("name cannot be empty");
    });
  });

  describe("Zodスキーマによるバリデーション", () => {
    test("有効なデータはZodスキーマのバリデーションを通過する", () => {
      // Arrange
      const validData = {
        id: 1,
        name: "和食基本セット",
        typeId: 1,
        imageId: 2,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        SeasoningTemplateSchema.parse(validData);
      }).not.toThrow();
    });

    test("typeIdが0の場合はZodバリデーションエラーが発生する", () => {
      // Arrange
      const invalidData = {
        id: 1,
        name: "和食基本セット",
        typeId: 0,
        imageId: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        SeasoningTemplateSchema.parse(invalidData);
      }).toThrow();
    });
  });
});
