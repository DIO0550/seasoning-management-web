/**
 * @fileoverview MySQLSeasoningRepository の統合テスト
 * 実際のデータベースとの統合、トランザクション、エラー回復のテスト
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
import type {
  SeasoningCreateInput,
  SeasoningUpdateInput,
} from "../../interfaces/ISeasoningRepository";

describe("MySQLSeasoningRepository - Integration Tests", () => {
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

  describe("Database Integration", () => {
    test("実際のデータベースとの完全なCRUDフロー", async () => {
      // Create
      const createInput: SeasoningCreateInput = {
        name: "統合テスト調味料",
        typeId: 1,
        imageId: 1,
        bestBeforeAt: new Date("2025-12-31"),
        expiresAt: new Date("2025-12-31"),
        purchasedAt: new Date("2024-01-01"),
      };

      const createResult = await repository.create(createInput);
      expect(createResult.id).toBeGreaterThan(0);

      // Read
      const created = await repository.findById(createResult.id);
      expect(created).not.toBeNull();
      expect(created!.name).toBe("統合テスト調味料");
      expect(created!.typeId).toBe(1);
      expect(created!.imageId).toBe(1);

      // Update
      const updateInput: SeasoningUpdateInput = {
        name: "更新された統合テスト調味料",
        typeId: 2,
        imageId: null,
      };

      const updateResult = await repository.update(
        createResult.id,
        updateInput
      );
      expect(updateResult.affectedRows).toBe(1);

      const updated = await repository.findById(createResult.id);
      expect(updated!.name).toBe("更新された統合テスト調味料");
      expect(updated!.typeId).toBe(2);
      expect(updated!.imageId).toBeNull();

      // Delete
      const deleteResult = await repository.delete(createResult.id);
      expect(deleteResult.affectedRows).toBe(1);

      const deleted = await repository.findById(createResult.id);
      expect(deleted).toBeNull();
    });

    test("データベース制約との統合", async () => {
      // 非常に長い名前でのテスト（VARCHAR(256)制約）
      const longNameInput: SeasoningCreateInput = {
        name: "a".repeat(300), // 256文字を超える
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      await expect(repository.create(longNameInput)).rejects.toThrow();
    });

    test("日付データの正確な保存と取得", async () => {
      // DATE型は時刻部分を保存しないため、日付のみでテスト
      const specificDate = new Date("2024-07-20");
      const input: SeasoningCreateInput = {
        name: "日付テスト調味料",
        typeId: 1,
        imageId: null,
        bestBeforeAt: specificDate,
        expiresAt: specificDate,
        purchasedAt: specificDate,
      };

      const result = await repository.create(input);
      const retrieved = await repository.findById(result.id);

      // DATE型では時刻部分が00:00:00になるため、日付部分のみを比較
      expect(retrieved!.bestBeforeAt?.toDateString()).toBe(
        specificDate.toDateString()
      );
      expect(retrieved!.expiresAt?.toDateString()).toBe(
        specificDate.toDateString()
      );
      expect(retrieved!.purchasedAt?.toDateString()).toBe(
        specificDate.toDateString()
      );
    });
  });

  describe("Complex Workflows", () => {
    test("複数のリポジトリメソッドを組み合わせたワークフロー", async () => {
      // ステップ1: 複数の調味料を作成
      const seasonings = await Promise.all([
        repository.create({
          name: "ワークフロー塩",
          typeId: 1,
          imageId: 1,
          bestBeforeAt: new Date("2024-12-31"),
          expiresAt: new Date("2024-12-31"),
          purchasedAt: new Date("2024-01-01"),
        }),
        repository.create({
          name: "ワークフロー醤油",
          typeId: 2,
          imageId: null,
          bestBeforeAt: new Date("2025-06-30"),
          expiresAt: new Date("2025-06-30"),
          purchasedAt: new Date("2024-02-01"),
        }),
        repository.create({
          name: "ワークフロー味噌",
          typeId: 3,
          imageId: 2,
          bestBeforeAt: new Date("2024-11-30"),
          expiresAt: new Date("2024-11-30"),
          purchasedAt: new Date("2024-03-01"),
        }),
      ]);

      // ステップ2: 検索で確認
      const searchResult = await repository.findAll({ search: "ワークフロー" });
      expect(searchResult.items).toHaveLength(3);

      // ステップ3: 名前で検索
      const saltResults = await repository.findByName("塩");
      expect(saltResults.some((s) => s.name === "ワークフロー塩")).toBe(true);

      // ステップ4: 期限切れ間近を検索
      const expiringSoon = await repository.findExpiringSoon(180); // 6ヶ月以内
      expect(expiringSoon.length).toBeGreaterThan(0);

      // ステップ5: カウント確認
      const totalCount = await repository.count();
      expect(totalCount).toBeGreaterThanOrEqual(6); // 初期データ3件 + 新規3件

      // ステップ6: 一括更新
      await Promise.all(
        seasonings.map((s) =>
          repository.update(s.id, { name: `更新済み${s.id}` })
        )
      );

      // ステップ7: 更新確認
      const updatedResults = await repository.findAll({ search: "更新済み" });
      expect(updatedResults.items).toHaveLength(3);
    });

    test("ページネーション付き検索の完全テスト", async () => {
      // 20件の調味料を作成
      const createPromises = Array.from({ length: 20 }, (_, i) =>
        repository.create({
          name: `ページネーション調味料${i.toString().padStart(2, "0")}`,
          typeId: (i % 3) + 1,
          imageId: i % 2 === 0 ? 1 : null,
          bestBeforeAt: null,
          expiresAt: null,
          purchasedAt: null,
        })
      );

      await Promise.all(createPromises);

      // 1ページ目（10件）
      const page1 = await repository.findAll({
        search: "ページネーション",
        pagination: { page: 1, limit: 10 },
        sort: { field: "id", direction: "ASC" }, // 明示的な順序指定を追加
      });

      expect(page1.items).toHaveLength(10);
      expect(page1.total).toBe(20);
      expect(page1.page).toBe(1);
      expect(page1.limit).toBe(10);
      expect(page1.totalPages).toBe(2);

      // 2ページ目（10件）
      const page2 = await repository.findAll({
        search: "ページネーション",
        pagination: { page: 2, limit: 10 },
        sort: { field: "id", direction: "ASC" }, // 明示的な順序指定を追加
      });

      expect(page2.items).toHaveLength(10);
      expect(page2.total).toBe(20);
      expect(page2.page).toBe(2);
      expect(page2.totalPages).toBe(2);

      // ページ間で重複がないことを確認
      const page1Ids = new Set(page1.items.map((item) => item.id));
      const page2Ids = new Set(page2.items.map((item) => item.id));
      const intersection = new Set(
        [...page1Ids].filter((id) => page2Ids.has(id))
      );
      expect(intersection.size).toBe(0);
    });
  });

  describe("Error Recovery", () => {
    test.skip("データベース接続エラーからの回復", async () => {
      // テスト環境では接続の切断/復旧をテストするのは困難なため、スキップ
      // 実際の環境では以下のようなテストが可能：
      // 1. 正常な操作を確認
      // 2. 接続を切断
      // 3. エラーが発生することを確認
      // 4. 接続を復旧
      // 5. 操作が再び可能になることを確認
    });

    test("無効なデータでの適切なエラーハンドリング", async () => {
      // NULL制約違反
      const invalidInput = {
        name: undefined,
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      } as unknown as SeasoningCreateInput;

      await expect(repository.create(invalidInput)).rejects.toThrow();

      // データベースの整合性が保たれていることを確認
      const count = await repository.count();
      expect(count).toBe(3); // 初期データのみ
    });
  });

  describe("Real-world Scenarios", () => {
    test("調味料管理の典型的なユースケース", async () => {
      // シナリオ: 新しい調味料を購入し、在庫管理する

      // 1. 新しい調味料を追加
      const newSeasoning = await repository.create({
        name: "有機醤油",
        typeId: 2,
        imageId: 1,
        bestBeforeAt: new Date("2025-12-31"),
        expiresAt: new Date("2025-12-31"),
        purchasedAt: new Date(),
      });

      // 2. 追加された調味料を確認
      const added = await repository.findById(newSeasoning.id);
      expect(added).not.toBeNull();
      expect(added!.name).toBe("有機醤油");

      // 3. 醤油系の調味料を検索
      const soySeasonings = await repository.findByTypeId(2);
      expect(soySeasonings.items.some((s) => s.id === newSeasoning.id)).toBe(
        true
      );

      // 4. 期限切れ間近の調味料をチェック
      const expiringSoon = await repository.findExpiringSoon(365);
      expect(expiringSoon.some((s) => s.id === newSeasoning.id)).toBe(true);

      // 5. 画像付きの調味料を検索
      const withImages = await repository.findAll({ hasImage: true });
      expect(withImages.items.some((s) => s.id === newSeasoning.id)).toBe(true);

      // 6. 調味料の情報を更新（消費期限を延長）
      await repository.update(newSeasoning.id, {
        expiresAt: new Date("2026-12-31"),
      });

      const updated = await repository.findById(newSeasoning.id);
      expect(updated!.expiresAt).toEqual(new Date("2026-12-31"));

      // 7. 使い切ったので削除
      await repository.delete(newSeasoning.id);
      const deleted = await repository.findById(newSeasoning.id);
      expect(deleted).toBeNull();
    });

    test("大量の調味料を管理するシナリオ", async () => {
      // シナリオ: レストランの調味料在庫管理

      // 1. 様々な調味料を大量に追加
      const seasoningTypes = [
        { name: "粗塩", typeId: 1 },
        { name: "精製塩", typeId: 1 },
        { name: "濃口醤油", typeId: 2 },
        { name: "薄口醤油", typeId: 2 },
        { name: "白味噌", typeId: 3 },
        { name: "赤味噌", typeId: 3 },
      ];

      const createdSeasonings = await Promise.all(
        seasoningTypes.map((type) =>
          repository.create({
            name: type.name,
            typeId: type.typeId,
            imageId: null,
            bestBeforeAt: new Date("2025-12-31"),
            expiresAt: new Date("2025-12-31"),
            purchasedAt: new Date(),
          })
        )
      );

      expect(createdSeasonings).toHaveLength(6);

      // 2. 種類別に在庫をチェック
      const saltStock = await repository.findByTypeId(1);
      expect(saltStock.items.length).toBeGreaterThanOrEqual(3); // 初期データ1件 + 新規2件

      const soyStock = await repository.findByTypeId(2);
      expect(soyStock.items.length).toBeGreaterThanOrEqual(3); // 初期データ1件 + 新規2件

      const misoStock = await repository.findByTypeId(3);
      expect(misoStock.items.length).toBeGreaterThanOrEqual(3); // 初期データ1件 + 新規2件

      // 3. 在庫総数を確認
      const totalStock = await repository.count();
      expect(totalStock).toBeGreaterThanOrEqual(9); // 初期データ3件 + 新規6件

      // 4. 特定の調味料を検索
      const misoSeasonings = await repository.findByName("味噌");
      expect(misoSeasonings.length).toBeGreaterThanOrEqual(3);

      // 5. 在庫一覧をページネーションで取得
      const stockList = await repository.findAll({
        pagination: { page: 1, limit: 5 },
      });
      expect(stockList.items).toHaveLength(5);
      expect(stockList.total).toBeGreaterThanOrEqual(9);
    });
  });
});
