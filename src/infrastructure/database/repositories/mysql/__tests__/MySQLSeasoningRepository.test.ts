/**
 * MySQLSeasoningRepositoryのテスト
 */

import { describe, it, expect, beforeEach } from "vitest";
import { MySQLSeasoningRepository } from "../MySQLSeasoningRepository";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core";
import { MockDatabaseConnection } from "@/libs/database/__tests__/mocks";

describe("MySQLSeasoningRepository", () => {
  let mockConnection: IDatabaseConnection;
  let repository: MySQLSeasoningRepository;

  beforeEach(async () => {
    mockConnection = new MockDatabaseConnection({
      host: "localhost",
      port: 3306,
      database: "test_db",
      username: "test_user",
      maxConnections: 10,
      minConnections: 2,
    });
    await mockConnection.connect(); // 接続を確立
    repository = new MySQLSeasoningRepository(mockConnection);
  });

  describe("コンストラクタ", () => {
    it("DB接続を受け取ることができる", () => {
      expect(repository).toBeDefined();
      expect(repository.connection).toBe(mockConnection);
    });

    it("connectionプロパティは公開されている", () => {
      expect(repository.connection).toBe(mockConnection);
    });
  });

  describe("インターフェース契約", () => {
    it("ISeasoningRepositoryを実装している", () => {
      // 必須メソッドの存在確認
      expect(typeof repository.create).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findAll).toBe("function");
      expect(typeof repository.update).toBe("function");
      expect(typeof repository.delete).toBe("function");
      expect(typeof repository.findByName).toBe("function");
      expect(typeof repository.findByTypeId).toBe("function");
      expect(typeof repository.findExpiringSoon).toBe("function");
      expect(typeof repository.count).toBe("function");
    });
  });

  describe("create", () => {
    it("調味料名が空の場合はエラーを投げる", async () => {
      await expect(
        repository.create({
          name: "",
          typeId: 1,
        })
      ).rejects.toThrow("調味料名は必須です");
    });

    it("調味料名がnullの場合はエラーを投げる", async () => {
      await expect(
        repository.create({
          name: null as unknown as string,
          typeId: 1,
        })
      ).rejects.toThrow("調味料名は必須です");
    });
  });

  describe("findById", () => {
    it("IDを受け取ることができる", async () => {
      const result = await repository.findById(1);
      // モックでは空の結果が返るのでnullになる
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("全ての調味料を取得できる形式のレスポンスを返す", async () => {
      const result = await repository.findAll();

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
      expect(result).toHaveProperty("totalPages");
      expect(Array.isArray(result.items)).toBe(true);
    });
  });
});
