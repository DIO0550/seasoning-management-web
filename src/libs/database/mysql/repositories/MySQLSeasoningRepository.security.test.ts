/**
 * @fileoverview MySQLSeasoningRepository のセキュリティテスト
 * SQL インジェクション対策やエラーハンドリングのテスト
 */

import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { MySQLSeasoningRepository } from "./MySQLSeasoningRepository";
import { TestDatabaseSetup, createTestDatabaseSetup } from "./testUtils";
import type { MySQLConnection } from "../connection/MySQLConnection";
import type { SeasoningCreateInput } from "../../interfaces/ISeasoningRepository";

describe("MySQLSeasoningRepository - Security Tests", () => {
  let testDb: TestDatabaseSetup;
  let connection: MySQLConnection;
  let repository: MySQLSeasoningRepository;

  beforeAll(async () => {
    testDb = createTestDatabaseSetup();
    connection = await testDb.setup();
    repository = new MySQLSeasoningRepository(connection);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  beforeEach(async () => {
    await testDb.clearTables();
    await testDb.insertTestData();
  });

  describe("SQL Injection Protection", () => {
    test("create メソッドでSQL インジェクション攻撃を防ぐ", async () => {
      // Arrange
      const maliciousInput: SeasoningCreateInput = {
        name: "'; DROP TABLE seasoning; --",
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act
      const result = await repository.create(maliciousInput);

      // Assert
      expect(result.id).toBeGreaterThan(0);

      // データベースが破壊されていないことを確認
      const count = await repository.count();
      expect(count).toBeGreaterThan(0);

      // 実際に悪意のある文字列が名前として保存されていることを確認
      const created = await repository.findById(result.id);
      expect(created!.name).toBe("'; DROP TABLE seasoning; --");
    });

    test("findByName メソッドでSQL インジェクション攻撃を防ぐ", async () => {
      // Arrange
      const maliciousQuery = "' OR '1'='1";

      // Act
      const result = await repository.findByName(maliciousQuery);

      // Assert
      // 悪意のあるクエリは単純な文字列として扱われ、マッチしない
      expect(result).toHaveLength(0);
    });

    test("findAll メソッドの検索でSQL インジェクション攻撃を防ぐ", async () => {
      // Arrange
      const maliciousSearch = "' UNION SELECT * FROM seasoning_type --";

      // Act
      const result = await repository.findAll({ search: maliciousSearch });

      // Assert
      // 悪意のあるクエリは単純な文字列として扱われ、マッチしない
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    test("特殊文字を含む正当な名前を適切に処理する", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "O'Neill's Salt & Pepper",
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);

      const created = await repository.findById(result.id);
      expect(created!.name).toBe("O'Neill's Salt & Pepper");
    });
  });

  describe("Input Validation", () => {
    test("非常に長い名前でエラーハンドリングをテスト", async () => {
      // Arrange
      const longName = "a".repeat(300); // 256文字を超える
      const input: SeasoningCreateInput = {
        name: longName,
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act & Assert
      // データベース制約によりエラーが発生することを期待
      await expect(repository.create(input)).rejects.toThrow();
    });

    test("Unicode文字を含む名前を適切に処理する", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "特製醤油 🍯 हिंदी العربية",
        typeId: 2,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);

      const created = await repository.findById(result.id);
      expect(created!.name).toBe("特製醤油 🍯 हिंदी العربية");
    });

    test("空白文字のみの名前はエラーになる", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "   \t\n   ",
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });
  });

  describe("Edge Cases", () => {
    test("大きなtypeIdでも適切に処理される", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "テスト調味料",
        typeId: 2147483647, // INT型の最大値
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act
      // 外部キー制約がないため、作成は成功するはず
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);
    });

    test("未来の日付を適切に処理する", async () => {
      // Arrange
      const futureDate = new Date("2099-12-31");
      const input: SeasoningCreateInput = {
        name: "未来の調味料",
        typeId: 1,
        imageId: null,
        bestBeforeAt: futureDate,
        expiresAt: futureDate,
        purchasedAt: futureDate,
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);

      const created = await repository.findById(result.id);
      expect(created!.bestBeforeAt).toEqual(futureDate);
      expect(created!.expiresAt).toEqual(futureDate);
      expect(created!.purchasedAt).toEqual(futureDate);
    });

    test("非常に古い日付を適切に処理する", async () => {
      // Arrange
      const oldDate = new Date("1900-01-01");
      const input: SeasoningCreateInput = {
        name: "古い調味料",
        typeId: 1,
        imageId: null,
        bestBeforeAt: oldDate,
        expiresAt: oldDate,
        purchasedAt: oldDate,
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);

      const created = await repository.findById(result.id);
      expect(created!.bestBeforeAt).toEqual(oldDate);
      expect(created!.expiresAt).toEqual(oldDate);
      expect(created!.purchasedAt).toEqual(oldDate);
    });
  });

  describe("Concurrent Operations", () => {
    test("同時実行でもデータ整合性が保たれる", async () => {
      // Arrange
      const promises = Array.from({ length: 10 }, (_, i) =>
        repository.create({
          name: `同時作成調味料${i}`,
          typeId: 1,
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
        })
      );

      // Act
      const results = await Promise.all(promises);

      // Assert
      // すべての作成が成功し、IDが重複していないことを確認
      const ids = results.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);

      // データベースに実際に10件追加されていることを確認
      const finalCount = await repository.count();
      expect(finalCount).toBe(13); // 初期データ3件 + 追加10件
    });
  });
});
