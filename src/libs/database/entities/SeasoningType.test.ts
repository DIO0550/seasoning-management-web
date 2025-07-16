/**
 * @fileoverview 調味料種類エンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect } from "vitest";
import { SeasoningType, SeasoningTypeSchema } from "./SeasoningType";

describe("SeasoningType Entity", () => {
  describe("エンティティの作成", () => {
    test("有効なデータでSeasoningTypeエンティティを作成できる", () => {
      // Arrange
      const validSeasoningTypeData = {
        id: 1,
        name: "液体調味料",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        const seasoningType = new SeasoningType(validSeasoningTypeData);
        expect(seasoningType.id).toBe(1);
        expect(seasoningType.name).toBe("液体調味料");
      }).not.toThrow();
    });

    test("nameが空文字の場合はエラーが発生する", () => {
      // Arrange
      const invalidSeasoningTypeData = {
        id: 1,
        name: "",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        new SeasoningType(invalidSeasoningTypeData);
      }).toThrow("name cannot be empty");
    });
  });

  describe("Zodスキーマによるバリデーション", () => {
    test("有効なデータはZodスキーマのバリデーションを通過する", () => {
      // Arrange
      const validData = {
        id: 1,
        name: "液体調味料",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        SeasoningTypeSchema.parse(validData);
      }).not.toThrow();
    });

    test("idが負数の場合はZodバリデーションエラーが発生する", () => {
      // Arrange
      const invalidData = {
        id: -1,
        name: "液体調味料",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        SeasoningTypeSchema.parse(invalidData);
      }).toThrow();
    });
  });
});
