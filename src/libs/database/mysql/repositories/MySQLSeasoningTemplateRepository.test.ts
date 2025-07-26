/**
 * @fileoverview MySQLSeasoningTemplateRepository のテスト
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
import { MySQLSeasoningTemplateRepository } from "./MySQLSeasoningTemplateRepository";
import { TestDatabaseSetup, createTestDatabaseSetup } from "./testUtils";
import type { MySQLConnection } from "@/libs/database/mysql/connection/MySQLConnection";
import { SeasoningTemplate } from "@/libs/database/entities/SeasoningTemplate";
import type {
  SeasoningTemplateCreateInput,
  SeasoningTemplateUpdateInput,
} from "@/libs/database/interfaces/ISeasoningTemplateRepository";

describe("MySQLSeasoningTemplateRepository", () => {
  let testDb: TestDatabaseSetup;
  let connection: MySQLConnection;
  let repository: MySQLSeasoningTemplateRepository;

  beforeAll(async () => {
    testDb = createTestDatabaseSetup();
    connection = await testDb.setup();
    repository = new MySQLSeasoningTemplateRepository(connection);
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
    test("新しい調味料テンプレートを作成できる", async () => {
      // Arrange
      const input: SeasoningTemplateCreateInput = {
        name: "醤油テンプレート",
        typeId: 1,
        imageId: 1,
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("画像IDなしで調味料テンプレートを作成できる", async () => {
      // Arrange
      const input: SeasoningTemplateCreateInput = {
        name: "味噌テンプレート",
        typeId: 2,
      };

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBeGreaterThan(0);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("空の名前では作成できない", async () => {
      // Arrange
      const input: SeasoningTemplateCreateInput = {
        name: "",
        typeId: 1,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });

    test("空白のみの名前では作成できない", async () => {
      // Arrange
      const input: SeasoningTemplateCreateInput = {
        name: "   ",
        typeId: 1,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });

    test("無効なtypeIdでは作成できない", async () => {
      // Arrange
      const input: SeasoningTemplateCreateInput = {
        name: "テストテンプレート",
        typeId: 0,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "typeId must be positive"
      );
    });
  });

  describe("findById", () => {
    test("存在するIDで調味料テンプレートを取得できる", async () => {
      // Arrange
      const createInput: SeasoningTemplateCreateInput = {
        name: "テスト調味料テンプレート",
        typeId: 1,
        imageId: 1,
      };
      const createResult = await repository.create(createInput);

      // Act
      const result = await repository.findById(createResult.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe(createResult.id);
      expect(result!.name).toBe("テスト調味料テンプレート");
      expect(result!.typeId).toBe(1);
      expect(result!.imageId).toBe(1);
    });

    test("存在しないIDではnullを返す", async () => {
      // Act
      const result = await repository.findById(99999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    test("調味料テンプレートを更新できる", async () => {
      // Arrange
      const createInput: SeasoningTemplateCreateInput = {
        name: "元の調味料テンプレート",
        typeId: 1,
        imageId: 1,
      };
      const createResult = await repository.create(createInput);

      const updateInput: SeasoningTemplateUpdateInput = {
        name: "更新された調味料テンプレート",
        typeId: 2,
        imageId: 2,
      };

      // Act
      const result = await repository.update(createResult.id, updateInput);

      // Assert
      expect(result.affectedRows).toBeGreaterThan(0);
      expect(result.updatedAt).toBeInstanceOf(Date);

      // 更新されたデータを確認
      const updated = await repository.findById(createResult.id);
      expect(updated!.name).toBe("更新された調味料テンプレート");
      expect(updated!.typeId).toBe(2);
      expect(updated!.imageId).toBe(2);
    });

    test("部分的に調味料テンプレートを更新できる", async () => {
      // Arrange
      const createInput: SeasoningTemplateCreateInput = {
        name: "元の調味料テンプレート",
        typeId: 1,
        imageId: 1,
      };
      const createResult = await repository.create(createInput);

      const updateInput: SeasoningTemplateUpdateInput = {
        name: "名前のみ更新",
      };

      // Act
      const result = await repository.update(createResult.id, updateInput);

      // Assert
      expect(result.affectedRows).toBeGreaterThan(0);

      // 更新されたデータを確認
      const updated = await repository.findById(createResult.id);
      expect(updated!.name).toBe("名前のみ更新");
      expect(updated!.typeId).toBe(1); // 変更されない
      expect(updated!.imageId).toBe(1); // 変更されない
    });

    test("存在しないIDでは更新できない", async () => {
      // Arrange
      const updateInput: SeasoningTemplateUpdateInput = {
        name: "存在しないテンプレート",
      };

      // Act & Assert
      await expect(repository.update(99999, updateInput)).rejects.toThrow(
        "Seasoning template not found"
      );
    });

    test("空の名前では更新できない", async () => {
      // Arrange
      const createInput: SeasoningTemplateCreateInput = {
        name: "元の調味料テンプレート",
        typeId: 1,
      };
      const createResult = await repository.create(createInput);

      const updateInput: SeasoningTemplateUpdateInput = {
        name: "",
      };

      // Act & Assert
      await expect(
        repository.update(createResult.id, updateInput)
      ).rejects.toThrow("name cannot be empty");
    });
  });

  describe("delete", () => {
    test("調味料テンプレートを削除できる", async () => {
      // Arrange
      const createInput: SeasoningTemplateCreateInput = {
        name: "削除する調味料テンプレート",
        typeId: 1,
      };
      const createResult = await repository.create(createInput);

      // Act
      const result = await repository.delete(createResult.id);

      // Assert
      expect(result.affectedRows).toBe(1);

      // 削除されたデータが取得できないことを確認
      const deleted = await repository.findById(createResult.id);
      expect(deleted).toBeNull();
    });

    test("存在しないIDでは削除できない", async () => {
      // Act
      const result = await repository.delete(99999);

      // Assert
      expect(result.affectedRows).toBe(0);
    });
  });

  describe("findByName", () => {
    test("名前で調味料テンプレートを検索できる", async () => {
      // Arrange - 新しいテンプレートを作成
      await repository.create({
        name: "醤油テンプレート",
        typeId: 1,
      });
      await repository.create({
        name: "味噌テンプレート",
        typeId: 2,
      });
      await repository.create({
        name: "塩テンプレート",
        typeId: 3,
      });

      // Act
      const result = await repository.findByName("醤油");

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("醤油テンプレート");
    });

    test("部分一致で調味料テンプレートを検索できる", async () => {
      // Arrange - 検索用のテンプレートのみ作成
      await repository.create({
        name: "薄口醤油テンプレート",
        typeId: 1,
      });
      await repository.create({
        name: "濃口醤油テンプレート",
        typeId: 1,
      });
      await repository.create({
        name: "味噌テンプレート",
        typeId: 2,
      });

      // Act
      const result = await repository.findByName("醤油");

      // Assert - テーブルをクリアしているので2個のはず
      expect(result).toHaveLength(2);
      const templateNames = result.map(
        (template: SeasoningTemplate) => template.name
      );
      expect(templateNames).toContain("薄口醤油テンプレート");
      expect(templateNames).toContain("濃口醤油テンプレート");
    });

    test("一致しない名前では空配列を返す", async () => {
      // Arrange
      await repository.create({
        name: "醤油テンプレート",
        typeId: 1,
      });

      // Act
      const result = await repository.findByName("存在しない調味料");

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe("existsByName", () => {
    test("名前が存在するときはtrueを返す", async () => {
      // Arrange
      await repository.create({
        name: "醤油テンプレート",
        typeId: 1,
      });

      // Act
      const result = await repository.existsByName("醤油テンプレート");

      // Assert
      expect(result).toBe(true);
    });

    test("名前が存在しないときはfalseを返す", async () => {
      // Act
      const result = await repository.existsByName("存在しない調味料");

      // Assert
      expect(result).toBe(false);
    });

    test("excludeIdを指定した場合、そのIDは除外される", async () => {
      // Arrange
      const created = await repository.create({
        name: "醤油テンプレート",
        typeId: 1,
      });

      // Act
      const result = await repository.existsByName(
        "醤油テンプレート",
        created.id
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("count", () => {
    test("調味料テンプレートの総数を取得できる", async () => {
      // Arrange
      await repository.create({
        name: "醤油テンプレート",
        typeId: 1,
      });
      await repository.create({
        name: "味噌テンプレート",
        typeId: 2,
      });

      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(2);
    });

    test("テーブルが空の場合は0を返す", async () => {
      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(0);
    });
  });
});
