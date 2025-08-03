/**
 * @fileoverview SeasoningTypeRepositoryのテストファイル
 * t-wada式TDDに基づき、コンストラクタ注入パターンの動作を検証
 */

import { describe, test, expect, beforeEach, vi } from "vitest";
import type { IDatabaseConnection } from "@/libs/database/interfaces/IDatabaseConnection";
import type { SeasoningTypeCreateInput } from "@/libs/database/interfaces/ISeasoningTypeRepository";
import { SeasoningTypeRepository } from "./SeasoningTypeRepository";

/**
 * モックのDatabaseConnection
 */
const createMockConnection = (): IDatabaseConnection => ({
  query: vi.fn(),
  beginTransaction: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn().mockReturnValue(true),
  ping: vi.fn(),
  getConfig: vi.fn(),
});

describe("SeasoningTypeRepository", () => {
  let mockConnection: IDatabaseConnection;
  let repository: SeasoningTypeRepository;

  beforeEach(() => {
    mockConnection = createMockConnection();
    repository = new SeasoningTypeRepository(mockConnection);
  });

  describe("コンストラクタ注入パターン", () => {
    test("コンストラクタでDB接続を受け取ることができる", () => {
      // コンストラクタで注入されたconnectionが保持されているか確認
      expect(repository.connection).toBe(mockConnection);
    });
  });

  describe("create", () => {
    test("調味料種類を作成できる", async () => {
      // Arrange
      const input: SeasoningTypeCreateInput = {
        name: "液体調味料",
      };

      const mockResult = {
        rows: [],
        rowsAffected: 1,
        insertId: 1,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockResult);

      // Act
      const result = await repository.create(input);

      // Assert
      expect(result.id).toBe(1);
      expect(result.createdAt).toBeDefined();
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO seasoning_type"),
        expect.any(Array)
      );
    });

    test("空の名前で調味料種類作成時にエラーが発生する", async () => {
      // Arrange
      const input: SeasoningTypeCreateInput = {
        name: "",
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });
  });

  describe("findById", () => {
    test("IDで調味料種類を取得できる", async () => {
      // Arrange
      const mockRow = {
        id: 1,
        name: "液体調味料",
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2023-01-01"),
      };

      const mockResult = {
        rows: [mockRow],
        rowsAffected: 1,
        insertId: null,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockResult);

      // Act
      const result = await repository.findById(1);

      // Assert
      expect(result).toBeTruthy();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("液体調味料");
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM seasoning_type WHERE id = ?"),
        [1]
      );
    });

    test("存在しないIDを指定時にnullを返す", async () => {
      // Arrange
      const mockResult = {
        rows: [],
        rowsAffected: 0,
        insertId: null,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockResult);

      // Act
      const result = await repository.findById(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    test("全ての調味料種類を取得できる", async () => {
      // Arrange
      const mockRows = [
        {
          id: 1,
          name: "液体調味料",
          created_at: new Date("2023-01-01"),
          updated_at: new Date("2023-01-01"),
        },
        {
          id: 2,
          name: "粉末調味料",
          created_at: new Date("2023-01-02"),
          updated_at: new Date("2023-01-02"),
        },
      ];

      const mockResult = {
        rows: mockRows,
        rowsAffected: 2,
        insertId: null,
      };

      vi.mocked(mockConnection.query).mockResolvedValue(mockResult);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.items[0].name).toBe("液体調味料");
      expect(result.items[1].name).toBe("粉末調味料");
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM seasoning_type")
      );
    });
  });
});
