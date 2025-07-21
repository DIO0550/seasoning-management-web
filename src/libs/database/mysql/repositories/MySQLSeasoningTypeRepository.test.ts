/**
 * @fileoverview MySQLSeasoningTypeRepository のテスト
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
import { MySQLSeasoningTypeRepository } from "./MySQLSeasoningTypeRepository";
import { TestDatabaseSetup, createTestDatabaseSetup } from "./testUtils";
import type { MySQLConnection } from "@/libs/database/mysql/connection/MySQLConnection";
import type {
  SeasoningTypeCreateInput,
  SeasoningTypeUpdateInput,
  SeasoningTypeSearchOptions,
} from "@/libs/database/interfaces/ISeasoningTypeRepository";

describe("MySQLSeasoningTypeRepository", () => {
  let testDb: TestDatabaseSetup;
  let connection: MySQLConnection;
  let repository: MySQLSeasoningTypeRepository;

  beforeAll(async () => {
    testDb = createTestDatabaseSetup();
    connection = await testDb.setup();
    repository = new MySQLSeasoningTypeRepository(connection);
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
    test("新しい調味料種類を作成できる", async () => {
      // Arrange
      const input: SeasoningTypeCreateInput = {
        name: "新しい調味料種類",
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("空の名前では作成できない", async () => {
      // Arrange
      const input: SeasoningTypeCreateInput = {
        name: "",
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });

    test("空白のみの名前では作成できない", async () => {
      // Arrange
      const input: SeasoningTypeCreateInput = {
        name: "   ",
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });

    test("重複する名前では作成できない", async () => {
      // Arrange
      const input: SeasoningTypeCreateInput = {
        name: "塩",
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow();
    });
  });

  describe("findById", () => {
    test("存在するIDで調味料種類を取得できる", async () => {
      // Act
      const result = await repository.findById(1);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("塩");
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });

    test("存在しないIDではnullを返す", async () => {
      // Act
      const result = await repository.findById(999);

      // Assert
      expect(result).toBeNull();
    });

    test("無効なIDではnullを返す", async () => {
      // Act
      const result = await repository.findById(-1);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    test("全ての調味料種類を取得できる", async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    test("ページネーションが正しく動作する", async () => {
      // Arrange
      const options: SeasoningTypeSearchOptions = {
        pagination: { page: 1, limit: 2 },
      };

      // Act
      const result = await repository.findAll(options);

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    test("検索条件で絞り込める", async () => {
      // Arrange
      const options: SeasoningTypeSearchOptions = {
        search: "醤油",
      };

      // Act
      const result = await repository.findAll(options);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("醤油");
    });

    test("ソート機能が動作する（昇順）", async () => {
      // Arrange
      const options: SeasoningTypeSearchOptions = {
        sort: { field: "name", direction: "ASC" },
      };

      // Act
      const result = await repository.findAll(options);

      // Assert
      expect(result.items[0].name).toBe("味噌");
      expect(result.items[1].name).toBe("塩");
      expect(result.items[2].name).toBe("醤油");
    });

    test("ソート機能が動作する（降順）", async () => {
      // Arrange
      const options: SeasoningTypeSearchOptions = {
        sort: { field: "name", direction: "DESC" },
      };

      // Act
      const result = await repository.findAll(options);

      // Assert
      expect(result.items[0].name).toBe("醤油");
      expect(result.items[1].name).toBe("塩");
      expect(result.items[2].name).toBe("味噌");
    });
  });

  describe("update", () => {
    test("調味料種類を更新できる", async () => {
      // Arrange
      const input: SeasoningTypeUpdateInput = {
        name: "更新された調味料種類",
      };

      // Act
      const result = await repository.update(1, input);

      // Assert
      expect(result.affectedRows).toBe(1);
      expect(result.updatedAt).toBeInstanceOf(Date);

      // 更新された内容を確認
      const updated = await repository.findById(1);
      expect(updated?.name).toBe("更新された調味料種類");
    });

    test("空の名前では更新できない", async () => {
      // Arrange
      const input: SeasoningTypeUpdateInput = {
        name: "",
      };

      // Act & Assert
      await expect(repository.update(1, input)).rejects.toThrow(
        "name cannot be empty"
      );
    });

    test("存在しないIDでは更新できない", async () => {
      // Arrange
      const input: SeasoningTypeUpdateInput = {
        name: "更新テスト",
      };

      // Act
      const result = await repository.update(999, input);

      // Assert
      expect(result.affectedRows).toBe(0);
    });

    test("重複する名前では更新できない", async () => {
      // Arrange
      const input: SeasoningTypeUpdateInput = {
        name: "醤油",
      };

      // Act & Assert
      await expect(repository.update(1, input)).rejects.toThrow();
    });

    test("同じ名前での更新は可能（自分自身への更新）", async () => {
      // Arrange
      const input: SeasoningTypeUpdateInput = {
        name: "塩",
      };

      // Act
      const result = await repository.update(1, input);

      // Assert
      expect(result.affectedRows).toBe(1);
    });
  });

  describe("delete", () => {
    test("調味料種類を削除できる", async () => {
      // Act
      const result = await repository.delete(1);

      // Assert
      expect(result.affectedRows).toBe(1);

      // 削除されたことを確認
      const deleted = await repository.findById(1);
      expect(deleted).toBeNull();
    });

    test("存在しないIDでは削除できない", async () => {
      // Act
      const result = await repository.delete(999);

      // Assert
      expect(result.affectedRows).toBe(0);
    });
  });

  describe("findByName", () => {
    test("名前で調味料種類を検索できる（完全一致）", async () => {
      // Act
      const result = await repository.findByName("塩");

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("塩");
    });

    test("名前で調味料種類を検索できる（部分一致）", async () => {
      // Act
      const result = await repository.findByName("醤");

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("醤油");
    });

    test("一致しない名前では空配列を返す", async () => {
      // Act
      const result = await repository.findByName("存在しない調味料");

      // Assert
      expect(result).toHaveLength(0);
    });

    test("空文字では全件を返す", async () => {
      // Act
      const result = await repository.findByName("");

      // Assert
      expect(result).toHaveLength(3);
    });
  });

  describe("existsByName", () => {
    test("存在する名前でtrueを返す", async () => {
      // Act
      const result = await repository.existsByName("塩");

      // Assert
      expect(result).toBe(true);
    });

    test("存在しない名前でfalseを返す", async () => {
      // Act
      const result = await repository.existsByName("存在しない調味料");

      // Assert
      expect(result).toBe(false);
    });

    test("除外IDを指定した場合、そのIDは無視される", async () => {
      // Act
      const result = await repository.existsByName("塩", 1);

      // Assert
      expect(result).toBe(false);
    });

    test("除外IDを指定しても他のレコードは検出される", async () => {
      // Act
      const result = await repository.existsByName("醤油", 1);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("count", () => {
    test("調味料種類の総数を取得できる", async () => {
      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(3);
    });

    test("データがない場合は0を返す", async () => {
      // Arrange
      await testDb.clearTables();

      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(0);
    });
  });
});
