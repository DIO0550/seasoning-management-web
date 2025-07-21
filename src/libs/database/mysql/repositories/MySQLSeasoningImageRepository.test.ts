/**
 * @fileoverview MySQLSeasoningImageRepository のテスト
 * TDD アプローチでテスト駆動開発
 */

import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { MySQLSeasoningImageRepository } from "./MySQLSeasoningImageRepository";
import { TestDatabaseSetup, createTestDatabaseSetup } from "./testUtils";
import type { MySQLConnection } from "@/libs/database/mysql/connection/MySQLConnection";

describe("MySQLSeasoningImageRepository", () => {
  let testDb: TestDatabaseSetup;
  let connection: MySQLConnection;
  let repository: MySQLSeasoningImageRepository;

  beforeAll(async () => {
    testDb = createTestDatabaseSetup();
    connection = await testDb.setup();
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  beforeEach(async () => {
    await testDb.clearTables();
    repository = new MySQLSeasoningImageRepository(connection);
  });

  describe("constructor", () => {
    test("インスタンスが正常に作成される", () => {
      expect(repository).toBeInstanceOf(MySQLSeasoningImageRepository);
      expect(repository.connection).toBe(connection);
    });
  });

  describe("generateUuid", () => {
    test("有効なUUIDv4を生成する", () => {
      const uuid = repository.generateUuid();

      // UUIDv4の形式をチェック
      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidV4Regex);
    });

    test("複数回呼び出すと異なるUUIDを生成する", () => {
      const uuid1 = repository.generateUuid();
      const uuid2 = repository.generateUuid();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("generateImagePath", () => {
    test("フォルダUUIDとファイル名から適切なパスを生成する", () => {
      const folderUuid = "550e8400-e29b-41d4-a716-446655440000";
      const filename = "sample.jpg";

      const result = repository.generateImagePath(folderUuid, filename);

      expect(result.fullPath).toBe(`uploads/images/${folderUuid}/${filename}`);
      expect(result.webPath).toBe(`/images/${folderUuid}/${filename}`);
      expect(result.absolutePath).toMatch(
        new RegExp(`${folderUuid}/${filename}$`)
      );
    });

    test("ファイル名に特殊文字が含まれても正常に処理する", () => {
      const folderUuid = "550e8400-e29b-41d4-a716-446655440000";
      const filename = "test-image_01.png";

      const result = repository.generateImagePath(folderUuid, filename);

      expect(result.fullPath).toBe(`uploads/images/${folderUuid}/${filename}`);
      expect(result.webPath).toBe(`/images/${folderUuid}/${filename}`);
    });
  });

  describe("create", () => {
    test("新しい調味料画像メタデータを作成できる", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      const result = await repository.create(input);

      expect(result.id).toBeTypeOf("number");
      expect(result.id).toBeGreaterThan(0);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("同じフォルダUUIDでの重複作成時にエラーが発生する", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      await repository.create(input);

      // 同じフォルダUUIDで再度作成しようとするとエラー
      await expect(repository.create(input)).rejects.toThrow();
    });
  });

  describe("findById", () => {
    test("存在するIDで調味料画像を取得できる", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      const createResult = await repository.create(input);
      const seasoningImage = await repository.findById(createResult.id);

      expect(seasoningImage).not.toBeNull();
      expect(seasoningImage!.id).toBe(createResult.id);
      expect(seasoningImage!.folderUuid).toBe(input.folderUuid);
      expect(seasoningImage!.filename).toBe(input.filename);
      expect(seasoningImage!.createdAt).toBeInstanceOf(Date);
      expect(seasoningImage!.updatedAt).toBeInstanceOf(Date);
    });

    test("存在しないIDの場合nullを返す", async () => {
      const result = await repository.findById(999);
      expect(result).toBeNull();
    });

    test("不正なIDの場合nullを返す", async () => {
      const result = await repository.findById(-1);
      expect(result).toBeNull();
    });
  });

  describe("findByFolderUuid", () => {
    test("存在するフォルダUUIDで調味料画像を取得できる", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      await repository.create(input);
      const result = await repository.findByFolderUuid(input.folderUuid);

      expect(result).not.toBeNull();
      expect(result!.folderUuid).toBe(input.folderUuid);
      expect(result!.filename).toBe(input.filename);
    });

    test("存在しないフォルダUUIDの場合nullを返す", async () => {
      const result = await repository.findByFolderUuid(
        "550e8400-e29b-41d4-a716-446655440999"
      );
      expect(result).toBeNull();
    });
  });

  describe("existsByFolderUuid", () => {
    test("存在するフォルダUUIDでtrueを返す", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      await repository.create(input);
      const exists = await repository.existsByFolderUuid(input.folderUuid);

      expect(exists).toBe(true);
    });

    test("存在しないフォルダUUIDでfalseを返す", async () => {
      const exists = await repository.existsByFolderUuid(
        "550e8400-e29b-41d4-a716-446655440999"
      );
      expect(exists).toBe(false);
    });

    test("excludeIdで自分自身を除外できる", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      const createResult = await repository.create(input);
      const exists = await repository.existsByFolderUuid(
        input.folderUuid,
        createResult.id
      );

      expect(exists).toBe(false);
    });
  });

  describe("count", () => {
    test("正確な件数を返す", async () => {
      const initialCount = await repository.count();
      expect(initialCount).toBe(0);

      await repository.create({
        folderUuid: "550e8400-e29b-41d4-a716-446655440001",
        filename: "test1.jpg",
      });

      await repository.create({
        folderUuid: "550e8400-e29b-41d4-a716-446655440002",
        filename: "test2.jpg",
      });

      const finalCount = await repository.count();
      expect(finalCount).toBe(2);
    });
  });

  describe("update", () => {
    test("調味料画像を更新できる", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      const createResult = await repository.create(input);
      const updateInput = {
        filename: "updated.jpg",
      };

      const updateResult = await repository.update(
        createResult.id,
        updateInput
      );

      expect(updateResult.affectedRows).toBe(1);
      expect(updateResult.updatedAt).toBeInstanceOf(Date);

      const updated = await repository.findById(createResult.id);
      expect(updated!.filename).toBe("updated.jpg");
    });

    test("存在しないIDでの更新は0行の影響を返す", async () => {
      const updateResult = await repository.update(999, {
        filename: "test.jpg",
      });
      expect(updateResult.affectedRows).toBe(0);
    });
  });

  describe("delete", () => {
    test("調味料画像を削除できる", async () => {
      const input = {
        folderUuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test.jpg",
      };

      const createResult = await repository.create(input);
      const deleteResult = await repository.delete(createResult.id);

      expect(deleteResult.affectedRows).toBe(1);

      const deleted = await repository.findById(createResult.id);
      expect(deleted).toBeNull();
    });

    test("存在しないIDでの削除は0行の影響を返す", async () => {
      const deleteResult = await repository.delete(999);
      expect(deleteResult.affectedRows).toBe(0);
    });
  });

  describe("findAll", () => {
    test("全ての調味料画像を取得できる", async () => {
      await repository.create({
        folderUuid: "550e8400-e29b-41d4-a716-446655440001",
        filename: "test1.jpg",
      });

      await repository.create({
        folderUuid: "550e8400-e29b-41d4-a716-446655440002",
        filename: "test2.jpg",
      });

      const result = await repository.findAll();

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.totalPages).toBe(1);
    });

    test("ページネーションが正常に動作する", async () => {
      for (let i = 1; i <= 5; i++) {
        await repository.create({
          folderUuid: `550e8400-e29b-41d4-a716-44665544000${i}`,
          filename: `test${i}.jpg`,
        });
      }

      const result = await repository.findAll({
        pagination: { page: 1, limit: 3 },
      });

      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(5);
      expect(result.totalPages).toBe(2);
    });
  });
});
