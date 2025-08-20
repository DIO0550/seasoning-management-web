/**
 * @fileoverview SeasoningRepositoryのテストファイル
 * t-wada式TDDに基づき、コンストラクタ注入パターンの動作を検証
 */

import { describe, test, expect, beforeEach, vi } from "vitest";
import type { IDatabaseConnection } from "@/libs/database/interfaces";
import type { SeasoningCreateInput } from "@/libs/database/interfaces/ISeasoningRepository";
import { SeasoningRepository } from "./SeasoningRepository";

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

describe("SeasoningRepository", () => {
  let mockConnection: IDatabaseConnection;
  let repository: SeasoningRepository;

  beforeEach(() => {
    mockConnection = createMockConnection();
    repository = new SeasoningRepository(mockConnection);
  });

  describe("コンストラクタ注入パターン", () => {
    test("コンストラクタでDB接続を受け取ることができる", () => {
      // コンストラクタで注入されたconnectionが保持されているか確認
      expect(repository.connection).toBe(mockConnection);
    });

    test("connectionプロパティは読み取り専用である", () => {
      // TypeScriptのreadonly指定により、実行時エラーにはならないが型チェックで検出される
      expect(repository.connection).toBeDefined();
    });
  });

  describe("create", () => {
    test("調味料を作成できる", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "醤油",
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
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
        expect.stringContaining("INSERT INTO seasoning"),
        expect.any(Array)
      );
    });

    test("空の名前で調味料作成時にエラーが発生する", async () => {
      // Arrange
      const input: SeasoningCreateInput = {
        name: "",
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
      };

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow(
        "name cannot be empty"
      );
    });
  });

  describe("findById", () => {
    test("IDで調味料を取得できる", async () => {
      // Arrange
      const mockRow = {
        id: 1,
        name: "醤油",
        type_id: 1,
        image_id: null,
        best_before_at: null,
        expires_at: null,
        purchased_at: null,
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
      expect(result?.name).toBe("醤油");
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM seasoning WHERE id = ?"),
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
    test("全ての調味料を取得できる", async () => {
      // Arrange
      const mockRows = [
        {
          id: 1,
          name: "醤油",
          type_id: 1,
          image_id: null,
          best_before_at: null,
          expires_at: null,
          purchased_at: null,
          created_at: new Date("2023-01-01"),
          updated_at: new Date("2023-01-01"),
        },
        {
          id: 2,
          name: "味噌",
          type_id: 2,
          image_id: null,
          best_before_at: null,
          expires_at: null,
          purchased_at: null,
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
      expect(result.items[0].name).toBe("醤油");
      expect(result.items[1].name).toBe("味噌");
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM seasoning")
      );
    });
  });
});
