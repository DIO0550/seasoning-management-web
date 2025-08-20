/**
 * @fileoverview SeasoningTemplateRepositoryのテスト
 * コンストラクタ注入パターンの調味料テンプレートリポジトリのテスト
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IDatabaseConnection } from "@/libs/database/interfaces";
import type { QueryResult } from "@/libs/database/interfaces";
import { SeasoningTemplateRepository } from "./SeasoningTemplateRepository";
import { SeasoningTemplate } from "@/libs/database/entities/SeasoningTemplate";

// モックDB接続
const mockConnection: IDatabaseConnection = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(),
  query: vi.fn(),
  beginTransaction: vi.fn(),
  ping: vi.fn(),
  getConfig: vi.fn(),
};

describe("SeasoningTemplateRepository", () => {
  let repository: SeasoningTemplateRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new SeasoningTemplateRepository(mockConnection);
  });

  describe("constructor", () => {
    it("should create instance with injected connection", () => {
      expect(repository).toBeInstanceOf(SeasoningTemplateRepository);
      expect(repository.connection).toBe(mockConnection);
    });
  });

  describe("create", () => {
    it("should create new seasoning template successfully", async () => {
      const createInput = {
        name: "Test Template",
        typeId: 1,
        imageId: 2,
      };

      const mockQueryResult: QueryResult = {
        rows: [],
        insertId: 1,
        rowsAffected: 1,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockQueryResult);

      const result = await repository.create(createInput);

      expect(result).toEqual({
        id: 1,
        createdAt: expect.any(Date),
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO seasoning_template"),
        ["Test Template", 1, 2]
      );
    });

    it("should throw error for empty name", async () => {
      const createInput = {
        name: "",
        typeId: 1,
        imageId: 2,
      };

      await expect(repository.create(createInput)).rejects.toThrow(
        "name cannot be empty"
      );

      expect(mockConnection.query).not.toHaveBeenCalled();
    });

    it("should throw error for whitespace-only name", async () => {
      const createInput = {
        name: "   ",
        typeId: 1,
        imageId: 2,
      };

      await expect(repository.create(createInput)).rejects.toThrow(
        "name cannot be empty"
      );

      expect(mockConnection.query).not.toHaveBeenCalled();
    });

    it("should create template without imageId", async () => {
      const createInput = {
        name: "Test Template",
        typeId: 1,
      };

      const mockQueryResult: QueryResult = {
        rows: [],
        insertId: 1,
        rowsAffected: 1,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockQueryResult);

      const result = await repository.create(createInput);

      expect(result).toEqual({
        id: 1,
        createdAt: expect.any(Date),
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO seasoning_template"),
        ["Test Template", 1, undefined]
      );
    });
  });

  describe("findById", () => {
    it("should return seasoning template when found", async () => {
      const mockRow = {
        id: 1,
        name: "Test Template",
        type_id: 1,
        image_id: 2,
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2023-01-02"),
      };

      const mockQueryResult: QueryResult = {
        rows: [mockRow],
        insertId: null,
        rowsAffected: 0,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockQueryResult);

      const result = await repository.findById(1);

      expect(result).toBeInstanceOf(SeasoningTemplate);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("Test Template");
      expect(result?.typeId).toBe(1);
      expect(result?.imageId).toBe(2);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM seasoning_template WHERE id = ?",
        [1]
      );
    });

    it("should return null when not found", async () => {
      const mockQueryResult: QueryResult = {
        rows: [],
        insertId: null,
        rowsAffected: 0,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockQueryResult);

      const result = await repository.findById(999);

      expect(result).toBeNull();

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM seasoning_template WHERE id = ?",
        [999]
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated result with all templates", async () => {
      const mockRows = [
        {
          id: 1,
          name: "Template 1",
          type_id: 1,
          image_id: 2,
          created_at: new Date("2023-01-01"),
          updated_at: new Date("2023-01-01"),
        },
        {
          id: 2,
          name: "Template 2",
          type_id: 2,
          image_id: null,
          created_at: new Date("2023-01-02"),
          updated_at: new Date("2023-01-02"),
        },
      ];

      const mockQueryResult: QueryResult = {
        rows: mockRows,
        insertId: null,
        rowsAffected: 0,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockQueryResult);

      const result = await repository.findAll();

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.items[0]).toBeInstanceOf(SeasoningTemplate);
      expect(result.items[1]).toBeInstanceOf(SeasoningTemplate);
      expect(result.items[1].imageId).toBeNull();

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM seasoning_template ORDER BY created_at DESC"
      );
    });

    it("should return empty result when no templates found", async () => {
      const mockQueryResult: QueryResult = {
        rows: [],
        insertId: null,
        rowsAffected: 0,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockQueryResult);

      const result = await repository.findAll();

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });

  describe("unimplemented methods", () => {
    it("should throw error for update method", async () => {
      await expect(repository.update(1, { name: "New Name" })).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for delete method", async () => {
      await expect(repository.delete(1)).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for findByName method", async () => {
      await expect(repository.findByName("Test")).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for findByTypeId method", async () => {
      await expect(repository.findByTypeId(1)).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for existsByName method", async () => {
      await expect(repository.existsByName("Test")).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for count method", async () => {
      await expect(repository.count()).rejects.toThrow(
        "Method not implemented."
      );
    });
  });
});
