/**
 * @fileoverview MySQLSeasoningRepository のテスト
 * TDD(Test-Driven Development)に基づいたテスト実装
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

describe("MySQLSeasoningRepository", () => {
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
    // 各テストの前にテーブルをクリアしてテストデータを挿入
    await testDb.clearTables();
    await testDb.insertTestData();
  });

  describe("create", () => {
    test("新しい調味料を作成できる", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "新しい調味料",
        typeId: 1,
        imageId: 1,
        bestBeforeAt: new Date("2025-12-31"),
        expiresAt: new Date("2025-12-31"),
        purchasedAt: new Date("2024-01-01"),
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("image_id がnullの調味料を作成できる", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "画像なし調味料",
        typeId: 2,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("name が空文字の場合はエラーになる", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "",
        typeId: 1,
        imageId: 1,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });

    test("name がnullや未定義の場合はエラーになる", async () => {
      // Arrange
      const input = {
        name: null,
        typeId: 1,
        imageId: 1,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      } as unknown as SeasoningCreateInput;

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });

    test("typeId が負の数の場合はエラーになる", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "テスト調味料",
        typeId: -1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "typeId must be positive"
      );
    });

    test("typeId が0の場合はエラーになる", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "テスト調味料",
        typeId: 0,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "typeId must be positive"
      );
    });
  });

  describe("findById", () => {
    test("存在するIDで調味料を取得できる", async () => {
      // Arrange - 最初のテストデータのIDを取得
      const result = await repository.findAll();
      const firstSeasoning = result.items[0];

      // Act
      const foundSeasoning = await repository.findById(firstSeasoning.id);

      // Assert
      expect(foundSeasoning).not.toBeNull();
      expect(foundSeasoning!.id).toBe(firstSeasoning.id);
      expect(foundSeasoning!.name).toBe("天然塩");
      expect(foundSeasoning!.typeId).toBe(1);
    });

    test("存在しないIDの場合はnullを返す", async () => {
      // Act
      const result = await repository.findById(999999);

      // Assert
      expect(result).toBeNull();
    });

    test("負の数のIDの場合はnullを返す", async () => {
      // Act
      const result = await repository.findById(-1);

      // Assert
      expect(result).toBeNull();
    });

    test("IDが0の場合はnullを返す", async () => {
      // Act
      const result = await repository.findById(0);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    test("全ての調味料を取得できる", async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    test("名前で検索できる", async () => {
      // Act
      const result = await repository.findAll({ search: "塩" });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("天然塩");
    });

    test("調味料種類IDで検索できる", async () => {
      // Act
      const result = await repository.findAll({ typeId: 2 });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("キッコーマン醤油");
    });

    test("画像の有無で検索できる", async () => {
      // Act
      const resultWithImage = await repository.findAll({ hasImage: true });
      const resultWithoutImage = await repository.findAll({ hasImage: false });

      // Assert
      expect(resultWithImage.items).toHaveLength(2);
      expect(resultWithoutImage.items).toHaveLength(1);
    });

    test("ページネーションが動作する", async () => {
      // Act
      const result = await repository.findAll({
        pagination: { page: 1, limit: 2 },
      });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(2);
    });
  });

  describe("update", () => {
    test("調味料を更新できる", async () => {
      // Arrange - 最初のテストデータのIDを取得
      const result = await repository.findAll();
      const firstSeasoning = result.items[0];

      const input: SeasoningUpdateInput = {
        name: "更新された塩",
        typeId: 2,
      };

      // Act
      const updateResult = await repository.update(firstSeasoning.id, input);

      // Assert
      expect(updateResult.affectedRows).toBe(1);
      expect(updateResult.updatedAt).toBeInstanceOf(Date);

      // 実際に更新されていることを確認
      const updated = await repository.findById(firstSeasoning.id);
      expect(updated!.name).toBe("更新された塩");
      expect(updated!.typeId).toBe(2);
    });

    test("部分的な更新ができる", async () => {
      // Arrange - 最初のテストデータのIDを取得
      const result = await repository.findAll();
      const firstSeasoning = result.items[0];

      const input: SeasoningUpdateInput = {
        name: "部分更新テスト",
      };

      // Act
      const updateResult = await repository.update(firstSeasoning.id, input);

      // Assert
      expect(updateResult.affectedRows).toBe(1);

      // 他のフィールドは変更されていないことを確認
      const updated = await repository.findById(firstSeasoning.id);
      expect(updated!.name).toBe("部分更新テスト");
      expect(updated!.typeId).toBe(1); // 元のまま
    });

    test("存在しないIDを更新しようとすると affected rows が 0 になる", async () => {
      // Arrange
      const input: SeasoningUpdateInput = {
        name: "存在しない",
      };

      // Act
      const result = await repository.update(999, input);

      // Assert
      expect(result.affectedRows).toBe(0);
    });

    test("更新内容が空の場合は何もしない", async () => {
      // Arrange - 最初のテストデータのIDを取得
      const result = await repository.findAll();
      const firstSeasoning = result.items[0];

      const input: SeasoningUpdateInput = {};

      // Act
      const updateResult = await repository.update(firstSeasoning.id, input);

      // Assert
      expect(updateResult.affectedRows).toBe(0);
    });
  });

  describe("delete", () => {
    test("調味料を削除できる", async () => {
      // Arrange - 最初のテストデータのIDを取得
      const result = await repository.findAll();
      const firstSeasoning = result.items[0];

      // Act
      const deleteResult = await repository.delete(firstSeasoning.id);

      // Assert
      expect(deleteResult.affectedRows).toBe(1);

      // 実際に削除されていることを確認
      const deleted = await repository.findById(firstSeasoning.id);
      expect(deleted).toBeNull();
    });

    test("存在しないIDを削除しようとすると affected rows が 0 になる", async () => {
      // Act
      const result = await repository.delete(999);

      // Assert
      expect(result.affectedRows).toBe(0);
    });
  });

  describe("findByName", () => {
    test("名前で調味料を検索できる", async () => {
      // Act
      const result = await repository.findByName("塩");

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("天然塩");
    });

    test("部分一致で検索できる", async () => {
      // Act
      const result = await repository.findByName("マン");

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("キッコーマン醤油");
    });

    test("該当がない場合は空配列を返す", async () => {
      // Act
      const result = await repository.findByName("存在しない調味料");

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe("findByTypeId", () => {
    test("調味料種類IDで検索できる", async () => {
      // Arrange - テストデータのtype_id=1の調味料を確認
      // Act
      const result = await repository.findByTypeId(1);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("天然塩");
      expect(result.items[0].typeId).toBe(1);
    });

    test("該当がない調味料種類IDの場合は空配列を返す", async () => {
      // Act
      const result = await repository.findByTypeId(999);

      // Assert
      expect(result.items).toHaveLength(0);
    });
  });

  describe("findExpiringSoon", () => {
    test("期限が近い調味料を取得できる", async () => {
      // Act
      const result = await repository.findExpiringSoon(365); // 1年以内

      // Assert
      expect(result.length).toBeGreaterThan(0);
      // 期限順にソートされていることを確認
      for (let i = 1; i < result.length; i++) {
        const prev = result[i - 1].expiresAt!;
        const curr = result[i].expiresAt!;
        expect(prev.getTime()).toBeLessThanOrEqual(curr.getTime());
      }
    });

    test("期限がないものは含まれない", async () => {
      // Act
      const result = await repository.findExpiringSoon(365);

      // Assert
      // すべてのアイテムでexpiresAtがnullでないことを確認
      result.forEach((item) => {
        expect(item.expiresAt).not.toBeNull();
      });
    });
  });

  describe("count", () => {
    test("調味料の総数を取得できる", async () => {
      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(3);
    });

    test("データが0件の場合は0を返す", async () => {
      // Arrange
      await testDb.clearTables(); // テストデータをクリア

      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(0);
    });
  });
});
