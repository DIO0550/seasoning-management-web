/**
 * リポジトリ契約テスト
 * @description Infrastructure層の実装がドメイン層のインターフェース契約を満たすことを検証
 */

import { test, expect, beforeEach } from "vitest";
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

// ISeasoningRepository 契約
test("[contract] MySQLSeasoningRepository は ISeasoningRepository を実装する", () => {
  const repository: ISeasoningRepository = new MySQLSeasoningRepository(
    mockConnection
  );

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

test("[contract] MySQLSeasoningRepository は connection プロパティを公開する", () => {
  const repository = new MySQLSeasoningRepository(mockConnection);
  expect(repository.connection).toBeDefined();
  expect(repository.connection).toBe(mockConnection);
});

// ISeasoningTypeRepository 契約
test("[contract] MySQLSeasoningTypeRepository は ISeasoningTypeRepository を実装する", () => {
  const repository: ISeasoningTypeRepository = new MySQLSeasoningTypeRepository(
    mockConnection
  );

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

// ISeasoningImageRepository 契約
test("[contract] MySQLSeasoningImageRepository は ISeasoningImageRepository を実装する", () => {
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

// ISeasoningTemplateRepository 契約
test("[contract] MySQLSeasoningTemplateRepository は ISeasoningTemplateRepository を実装する", () => {
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

// 型互換性
test("[contract] MySQL リポジトリはドメインインターフェース型として使用できる", () => {
  const seasoningRepo: ISeasoningRepository = new MySQLSeasoningRepository(
    mockConnection
  );
  const typeRepo: ISeasoningTypeRepository = new MySQLSeasoningTypeRepository(
    mockConnection
  );
  const imageRepo: ISeasoningImageRepository =
    new MySQLSeasoningImageRepository(mockConnection);
  const templateRepo: ISeasoningTemplateRepository =
    new MySQLSeasoningTemplateRepository(mockConnection);

  expect(seasoningRepo).toBeInstanceOf(MySQLSeasoningRepository);
  expect(typeRepo).toBeInstanceOf(MySQLSeasoningTypeRepository);
  expect(imageRepo).toBeInstanceOf(MySQLSeasoningImageRepository);
  expect(templateRepo).toBeInstanceOf(MySQLSeasoningTemplateRepository);
});

// DIP 検証
test("[contract] Infrastructure 実装が Domain 抽象 (IDatabaseConnection) に依存する", () => {
  const repository = new MySQLSeasoningRepository(mockConnection);
  expect(repository).toBeDefined();
  expect(repository.connection).toBe(mockConnection);
});
