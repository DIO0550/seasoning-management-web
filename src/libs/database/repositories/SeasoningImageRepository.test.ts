/**
 * @fileoverview SeasoningImageRepositoryのテスト
 * コンストラクタ注入パターンの調味料画像リポジトリのテスト
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IDatabaseConnection } from "@/libs/database/interfaces";
import type { QueryResult } from "@/libs/database/interfaces";
import { SeasoningImageRepository } from "./SeasoningImageRepository";
import { SeasoningImage } from "@/libs/database/entities/SeasoningImage";

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

describe("SeasoningImageRepository", () => {
  let repository: SeasoningImageRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new SeasoningImageRepository(mockConnection);
  });

  describe("constructor", () => {
    it("should create instance with injected connection", () => {
      expect(repository).toBeInstanceOf(SeasoningImageRepository);
      expect(repository.connection).toBe(mockConnection);
    });
  });

  describe("create", () => {
    it("should create new seasoning image successfully", async () => {
      const createInput = {
        folderUuid: "test-uuid-123",
        filename: "test-image.jpg",
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
        expect.stringContaining("INSERT INTO seasoning_image"),
        ["test-uuid-123", "test-image.jpg"]
      );
    });

    it("should throw error for empty filename", async () => {
      const createInput = {
        folderUuid: "test-uuid-123",
        filename: "",
      };

      await expect(repository.create(createInput)).rejects.toThrow(
        "filename cannot be empty"
      );

      expect(mockConnection.query).not.toHaveBeenCalled();
    });

    it("should throw error for whitespace-only filename", async () => {
      const createInput = {
        folderUuid: "test-uuid-123",
        filename: "   ",
      };

      await expect(repository.create(createInput)).rejects.toThrow(
        "filename cannot be empty"
      );

      expect(mockConnection.query).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return seasoning image when found", async () => {
      const mockRow = {
        id: 1,
        folder_uuid: "550e8400-e29b-41d4-a716-446655440000",
        filename: "test-image.jpg",
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

      expect(result).toBeInstanceOf(SeasoningImage);
      expect(result?.id).toBe(1);
      expect(result?.folderUuid).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(result?.filename).toBe("test-image.jpg");

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM seasoning_image WHERE id = ?",
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
        "SELECT * FROM seasoning_image WHERE id = ?",
        [999]
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated result with all seasoning images", async () => {
      const mockRows = [
        {
          id: 1,
          folder_uuid: "550e8400-e29b-41d4-a716-446655440000",
          filename: "image1.jpg",
          created_at: new Date("2023-01-01"),
          updated_at: new Date("2023-01-01"),
        },
        {
          id: 2,
          folder_uuid: "550e8400-e29b-41d4-a716-446655440001",
          filename: "image2.jpg",
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
      expect(result.items[0]).toBeInstanceOf(SeasoningImage);
      expect(result.items[1]).toBeInstanceOf(SeasoningImage);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM seasoning_image ORDER BY created_at DESC"
      );
    });

    it("should return empty result when no images found", async () => {
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
      await expect(
        repository.update(1, { filename: "new.jpg" })
      ).rejects.toThrow("Method not implemented.");
    });

    it("should throw error for delete method", async () => {
      await expect(repository.delete(1)).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for findByFilename method", async () => {
      await expect(repository.findByFilename("test.jpg")).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for findByMimeType method", async () => {
      await expect(repository.findByMimeType("image/jpeg")).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for findByFolderUuid method", async () => {
      await expect(repository.findByFolderUuid("uuid")).rejects.toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for generateUuid method", () => {
      expect(() => repository.generateUuid()).toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for generateImagePath method", () => {
      expect(() => repository.generateImagePath("uuid", "file.jpg")).toThrow(
        "Method not implemented."
      );
    });

    it("should throw error for existsByFolderUuid method", async () => {
      await expect(repository.existsByFolderUuid("uuid")).rejects.toThrow(
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
