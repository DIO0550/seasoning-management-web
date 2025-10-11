/**
 * リポジトリ契約テスト
 * @description Infrastructure層の実装がドメイン層のインターフェース契約を満たすことを検証
 */

import { describe, it, expect, beforeEach } from "vitest";
import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
  ISeasoningTemplateRepository,
} from "@/libs/database/interfaces";
import {
  MySQLSeasoningRepository,
  MySQLSeasoningTypeRepository,
  MySQLSeasoningImageRepository,
  MySQLSeasoningTemplateRepository,
} from "@/infrastructure/database/repositories/mysql";
import { MockDatabaseConnection } from "@/libs/database/__tests__/mocks";

/**
 * リポジトリ契約テスト
 * Infrastructure実装がドメインインターフェースの契約を満たすことを確認
 */
describe("Repository Contract Tests", () => {
  let mockConnection: MockDatabaseConnection;

  beforeEach(async () => {
    mockConnection = new MockDatabaseConnection({
      host: "localhost",
      port: 3306,
      database: "test_db",
      username: "test_user",
      maxConnections: 10,
      minConnections: 2,
    });
    await mockConnection.connect();
  });

  describe("ISeasoningRepository契約", () => {
    it("MySQLSeasoningRepositoryはISeasoningRepositoryインターフェースを実装している", () => {
      const repository: ISeasoningRepository = new MySQLSeasoningRepository(
        mockConnection
      );

      // インターフェースの必須メソッドが存在することを確認
      expect(repository.create).toBeDefined();
      expect(typeof repository.create).toBe("function");

      expect(repository.findById).toBeDefined();
      expect(typeof repository.findById).toBe("function");

      expect(repository.findAll).toBeDefined();
      expect(typeof repository.findAll).toBe("function");

      expect(repository.update).toBeDefined();
      expect(typeof repository.update).toBe("function");

      expect(repository.delete).toBeDefined();
      expect(typeof repository.delete).toBe("function");

      expect(repository.findByTypeId).toBeDefined();
      expect(typeof repository.findByTypeId).toBe("function");

      expect(repository.findExpiringSoon).toBeDefined();
      expect(typeof repository.findExpiringSoon).toBe("function");

      expect(repository.count).toBeDefined();
      expect(typeof repository.count).toBe("function");
    });

    it("connectionプロパティが存在する", () => {
      const repository = new MySQLSeasoningRepository(mockConnection);
      expect(repository.connection).toBeDefined();
      expect(repository.connection).toBe(mockConnection);
    });
  });

  describe("ISeasoningTypeRepository契約", () => {
    it("MySQLSeasoningTypeRepositoryはISeasoningTypeRepositoryインターフェースを実装している", () => {
      const repository: ISeasoningTypeRepository =
        new MySQLSeasoningTypeRepository(mockConnection);

      expect(repository.create).toBeDefined();
      expect(typeof repository.create).toBe("function");

      expect(repository.findById).toBeDefined();
      expect(typeof repository.findById).toBe("function");

      expect(repository.findAll).toBeDefined();
      expect(typeof repository.findAll).toBe("function");

      expect(repository.update).toBeDefined();
      expect(typeof repository.update).toBe("function");

      expect(repository.delete).toBeDefined();
      expect(typeof repository.delete).toBe("function");

      expect(repository.findByName).toBeDefined();
      expect(typeof repository.findByName).toBe("function");

      expect(repository.connection).toBeDefined();
    });
  });

  describe("ISeasoningImageRepository契約", () => {
    it("MySQLSeasoningImageRepositoryはISeasoningImageRepositoryインターフェースを実装している", () => {
      const repository: ISeasoningImageRepository =
        new MySQLSeasoningImageRepository(mockConnection);

      expect(repository.create).toBeDefined();
      expect(typeof repository.create).toBe("function");

      expect(repository.findById).toBeDefined();
      expect(typeof repository.findById).toBe("function");

      expect(repository.findAll).toBeDefined();
      expect(typeof repository.findAll).toBe("function");

      expect(repository.update).toBeDefined();
      expect(typeof repository.update).toBe("function");

      expect(repository.delete).toBeDefined();
      expect(typeof repository.delete).toBe("function");

      expect(repository.findByFolderUuid).toBeDefined();
      expect(typeof repository.findByFolderUuid).toBe("function");

      expect(repository.generateUuid).toBeDefined();
      expect(typeof repository.generateUuid).toBe("function");

      expect(repository.generateImagePath).toBeDefined();
      expect(typeof repository.generateImagePath).toBe("function");

      expect(repository.existsByFolderUuid).toBeDefined();
      expect(typeof repository.existsByFolderUuid).toBe("function");

      expect(repository.count).toBeDefined();
      expect(typeof repository.count).toBe("function");

      expect(repository.connection).toBeDefined();
    });
  });

  describe("ISeasoningTemplateRepository契約", () => {
    it("MySQLSeasoningTemplateRepositoryはISeasoningTemplateRepositoryインターフェースを実装している", () => {
      const repository: ISeasoningTemplateRepository =
        new MySQLSeasoningTemplateRepository(mockConnection);

      expect(repository.create).toBeDefined();
      expect(typeof repository.create).toBe("function");

      expect(repository.findById).toBeDefined();
      expect(typeof repository.findById).toBe("function");

      expect(repository.findAll).toBeDefined();
      expect(typeof repository.findAll).toBe("function");

      expect(repository.update).toBeDefined();
      expect(typeof repository.update).toBe("function");

      expect(repository.delete).toBeDefined();
      expect(typeof repository.delete).toBe("function");

      expect(repository.findByTypeId).toBeDefined();
      expect(typeof repository.findByTypeId).toBe("function");

      expect(repository.findByName).toBeDefined();
      expect(typeof repository.findByName).toBe("function");

      expect(repository.count).toBeDefined();
      expect(typeof repository.count).toBe("function");

      expect(repository.connection).toBeDefined();
    });
  });

  describe("型互換性テスト", () => {
    it("MySQLリポジトリはドメインインターフェース型として使用できる", () => {
      // 型チェック: コンパイル時に検証される
      const seasoningRepo: ISeasoningRepository = new MySQLSeasoningRepository(
        mockConnection
      );
      const typeRepo: ISeasoningTypeRepository =
        new MySQLSeasoningTypeRepository(mockConnection);
      const imageRepo: ISeasoningImageRepository =
        new MySQLSeasoningImageRepository(mockConnection);
      const templateRepo: ISeasoningTemplateRepository =
        new MySQLSeasoningTemplateRepository(mockConnection);

      // 実行時に型が正しいことを確認
      expect(seasoningRepo).toBeInstanceOf(MySQLSeasoningRepository);
      expect(typeRepo).toBeInstanceOf(MySQLSeasoningTypeRepository);
      expect(imageRepo).toBeInstanceOf(MySQLSeasoningImageRepository);
      expect(templateRepo).toBeInstanceOf(MySQLSeasoningTemplateRepository);
    });
  });

  describe("依存性逆転の原則（DIP）検証", () => {
    it("Infrastructure実装がDomain抽象化に依存している", () => {
      // MySQLリポジトリはIDatabaseConnection（Domain層の抽象）を受け取る
      const repository = new MySQLSeasoningRepository(mockConnection);

      // Infrastructure実装がDomain層のインターフェースを満たす
      expect(repository).toBeDefined();
      expect(repository.connection).toBe(mockConnection);

      // これはDIPの実現: 上位モジュール（Domain）が下位モジュール（Infrastructure）に依存しない
      // 両方とも抽象（インターフェース）に依存している
    });
  });
});
