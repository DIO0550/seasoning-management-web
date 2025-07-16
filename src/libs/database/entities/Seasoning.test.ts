/**
 * @fileoverview 調味料エンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect } from "vitest";
import { Seasoning, SeasoningSchema } from "./Seasoning";

describe("Seasoning Entity", () => {
  describe("エンティティの作成", () => {
    test("有効なデータでSeasoningエンティティを作成できる", () => {
      // Arrange
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

      // Act & Assert
      expect(() => {
        const seasoning = new Seasoning(validSeasoningData);
        expect(seasoning.id).toBe(1);
        expect(seasoning.name).toBe("醤油");
        expect(seasoning.typeId).toBe(1);
      }).not.toThrow();
    });

    test("nameが空文字の場合はエラーが発生する", () => {
      // Arrange
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

      // Act & Assert
      expect(() => {
        new Seasoning(invalidSeasoningData);
      }).toThrow("name cannot be empty");
    });
  });

  describe("Zodスキーマによるバリデーション", () => {
    test("有効なデータはZodスキーマのバリデーションを通過する", () => {
      // Arrange
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

      // Act & Assert
      expect(() => {
        SeasoningSchema.parse(validData);
      }).not.toThrow();
    });

    test("nameが文字列でない場合はZodバリデーションエラーが発生する", () => {
      // Arrange
      const invalidData = {
        id: 1,
        name: 123, // 数値なのでエラー
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Act & Assert
      expect(() => {
        SeasoningSchema.parse(invalidData);
      }).toThrow();
    });
  });
});
