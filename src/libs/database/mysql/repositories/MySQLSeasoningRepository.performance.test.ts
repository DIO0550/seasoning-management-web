/**
 * @fileoverview MySQLSeasoningRepository のパフォーマンステスト
 * 大量データでのパフォーマンスとスケーラビリティのテスト
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
import type { Seasoning } from "../../entities/Seasoning";

describe("MySQLSeasoningRepository - Performance Tests", () => {
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

  describe("Bulk Operations Performance", () => {
    test("大量データの作成パフォーマンス", async () => {
      // Arrange
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 100 },
        (_, i) => ({
          name: `パフォーマンステスト調味料${i}`,
          typeId: (i % 3) + 1, // 1, 2, 3をローテーション
          imageId: i % 2 === 0 ? 1 : null,
          bestBeforeAt: new Date(`2025-${(i % 12) + 1}-01`),
          expiresAt: new Date(`2025-${(i % 12) + 1}-01`),
          purchasedAt: new Date("2024-01-01"),
        })
      );

      // Act
      const startTime = Date.now();
      const promises = createInputs.map((input) => repository.create(input));
      const results = await Promise.all(promises);
      const endTime = Date.now();

      // Assert
      expect(results).toHaveLength(100);
      expect(results.every((r) => r.id > 0)).toBe(true);

      const duration = endTime - startTime;
      console.log(`100件の作成にかかった時間: ${duration}ms`);

      // パフォーマンス基準: 100件の作成が5秒以内
      expect(duration).toBeLessThan(5000);
    });

    test("大量データの検索パフォーマンス", async () => {
      // Arrange
      // 500件のテストデータを作成
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 500 },
        (_, i) => ({
          name: `検索テスト${i % 10 === 0 ? "特殊" : "通常"}調味料${i}`,
          typeId: (i % 3) + 1,
          imageId: i % 2 === 0 ? 1 : null,
          bestBeforeAt: new Date(`2025-${(i % 12) + 1}-01`),
          expiresAt: new Date(`2025-${(i % 12) + 1}-01`),
          purchasedAt: new Date("2024-01-01"),
        })
      );

      await Promise.all(createInputs.map((input) => repository.create(input)));

      // Act
      const startTime = Date.now();
      const result = await repository.findAll({
        search: "特殊",
        pagination: { page: 1, limit: 50 },
      });
      const endTime = Date.now();

      // Assert
      expect(result.items.length).toBeLessThanOrEqual(50);
      expect(result.total).toBeGreaterThan(0);

      const duration = endTime - startTime;
      console.log(`500件から検索にかかった時間: ${duration}ms`);

      // パフォーマンス基準: 検索が1秒以内
      expect(duration).toBeLessThan(1000);
    });

    test("ページネーションのパフォーマンス", async () => {
      // Arrange
      // 200件のテストデータを作成
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 200 },
        (_, i) => ({
          name: `ページネーションテスト調味料${i}`,
          typeId: (i % 3) + 1,
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
        })
      );

      await Promise.all(createInputs.map((input) => repository.create(input)));

      // Act - 複数ページを取得
      const startTime = Date.now();
      const pagePromises = Array.from({ length: 10 }, (_, i) =>
        repository.findAll({
          pagination: { page: i + 1, limit: 20 },
        })
      );
      const pages = await Promise.all(pagePromises);
      const endTime = Date.now();

      // Assert
      expect(pages).toHaveLength(10);
      pages.forEach((page) => {
        expect(page.limit).toBe(20);
        expect(page.total).toBeGreaterThan(200);
      });

      const duration = endTime - startTime;
      console.log(`10ページ同時取得にかかった時間: ${duration}ms`);

      // パフォーマンス基準: 10ページ同時取得が2秒以内
      expect(duration).toBeLessThan(2000);
    });
  });

  describe("Complex Query Performance", () => {
    test("複合条件検索のパフォーマンス", async () => {
      // Arrange
      // 300件の多様なテストデータを作成
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 300 },
        (_, i) => ({
          name: `複合検索テスト${
            i % 5 === 0 ? "塩" : i % 3 === 0 ? "醤油" : "その他"
          }${i}`,
          typeId: (i % 3) + 1,
          imageId: i % 4 === 0 ? 1 : null,
          bestBeforeAt: i % 6 === 0 ? new Date("2024-12-31") : null,
          expiresAt:
            i % 5 === 0 ? new Date("2024-12-31") : new Date("2025-12-31"),
          purchasedAt: new Date(`2024-${(i % 12) + 1}-01`),
        })
      );

      await Promise.all(createInputs.map((input) => repository.create(input)));

      // Act
      const startTime = Date.now();
      const result = await repository.findAll({
        search: "塩",
        typeId: 1,
        hasImage: true,
        expirationDateRange: {
          from: new Date("2024-01-01"),
          to: new Date("2025-12-31"),
        },
        pagination: { page: 1, limit: 20 },
      });
      const endTime = Date.now();

      // Assert
      expect(result.items.length).toBeLessThanOrEqual(20);

      const duration = endTime - startTime;
      console.log(`複合条件検索にかかった時間: ${duration}ms`);

      // パフォーマンス基準: 複合条件検索が500ms以内
      expect(duration).toBeLessThan(500);
    });

    test("期限切れ近接検索のパフォーマンス", async () => {
      // Arrange
      // 期限が様々な調味料を作成
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 200 },
        (_, i) => {
          const daysFromNow = i - 100; // -100から+99日
          const date = new Date();
          date.setDate(date.getDate() + daysFromNow);

          return {
            name: `期限テスト調味料${i}`,
            typeId: (i % 3) + 1,
            imageId: null,
            bestBeforeAt: null,
            expiresAt: date,
            purchasedAt: new Date("2024-01-01"),
          };
        }
      );

      await Promise.all(createInputs.map((input) => repository.create(input)));

      // Act
      const startTime = Date.now();
      const result = await repository.findExpiringSoon(30); // 30日以内
      const endTime = Date.now();

      // Assert
      expect(result.length).toBeGreaterThan(0);
      // 期限順にソートされていることを確認
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].expiresAt!.getTime()).toBeLessThanOrEqual(
          result[i].expiresAt!.getTime()
        );
      }

      const duration = endTime - startTime;
      console.log(`期限切れ近接検索にかかった時間: ${duration}ms`);

      // パフォーマンス基準: 期限切れ検索が300ms以内
      expect(duration).toBeLessThan(300);
    });
  });

  describe("Update and Delete Performance", () => {
    test("大量更新のパフォーマンス", async () => {
      // Arrange
      // 100件作成
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 100 },
        (_, i) => ({
          name: `更新テスト調味料${i}`,
          typeId: 1,
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
        })
      );

      const createResults = await Promise.all(
        createInputs.map((input) => repository.create(input))
      );

      // Act
      const startTime = Date.now();
      const updatePromises = createResults.map((result, i) =>
        repository.update(result.id, {
          name: `更新済み調味料${i}`,
          typeId: 2,
        })
      );
      const updateResults = await Promise.all(updatePromises);
      const endTime = Date.now();

      // Assert
      expect(updateResults.every((r) => r.affectedRows === 1)).toBe(true);

      const duration = endTime - startTime;
      console.log(`100件の更新にかかった時間: ${duration}ms`);

      // パフォーマンス基準: 100件の更新が3秒以内
      expect(duration).toBeLessThan(3000);
    });

    test("大量削除のパフォーマンス", async () => {
      // Arrange
      // 50件作成
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 50 },
        (_, i) => ({
          name: `削除テスト調味料${i}`,
          typeId: 1,
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
        })
      );

      const createResults = await Promise.all(
        createInputs.map((input) => repository.create(input))
      );

      // Act
      const startTime = Date.now();
      const deletePromises = createResults.map((result) =>
        repository.delete(result.id)
      );
      const deleteResults = await Promise.all(deletePromises);
      const endTime = Date.now();

      // Assert
      expect(deleteResults.every((r) => r.affectedRows === 1)).toBe(true);

      const duration = endTime - startTime;
      console.log(`50件の削除にかかった時間: ${duration}ms`);

      // パフォーマンス基準: 50件の削除が2秒以内
      expect(duration).toBeLessThan(2000);
    });
  });

  describe("Memory Usage", () => {
    test("大量データ取得時のメモリ効率", async () => {
      // Arrange
      // 1000件作成
      const createInputs: SeasoningCreateInput[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          name: `メモリテスト調味料${i}`,
          typeId: (i % 3) + 1,
          imageId: null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
        })
      );

      await Promise.all(createInputs.map((input) => repository.create(input)));

      // Act
      const memoryBefore = process.memoryUsage();

      // 小さなページサイズで複数回取得（ストリーミング的な処理をシミュレート）
      const allItems: Seasoning[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await repository.findAll({
          pagination: { page, limit: 50 },
        });
        allItems.push(...result.items);
        hasMore = result.items.length === 50;
        page++;
      }

      const memoryAfter = process.memoryUsage();

      // Assert
      expect(allItems.length).toBeGreaterThan(1000);

      const memoryIncrease = memoryAfter.heapUsed - memoryBefore.heapUsed;
      console.log(
        `メモリ使用量の増加: ${
          Math.round((memoryIncrease / 1024 / 1024) * 100) / 100
        }MB`
      );

      // メモリ使用量が合理的な範囲内であることを確認（100MB以下）
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
  });
});
