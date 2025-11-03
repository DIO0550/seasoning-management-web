/**
 * @fileoverview 調味料種類リポジトリインターフェースのテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect, beforeEach } from "vitest";
import type {
  ISeasoningTypeRepository,
  SeasoningTypeSearchOptions,
  SeasoningTypeCreateInput,
  SeasoningTypeUpdateInput,
} from "../ISeasoningTypeRepository";
import type { SeasoningType } from "../../../entities/SeasoningType";
import type {
  PaginatedResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
} from "../../common/types";
import type { IDatabaseConnection } from "../../core/IDatabaseConnection";

// モック実装（テスト用）
class MockSeasoningTypeRepository implements ISeasoningTypeRepository {
  public readonly connection: IDatabaseConnection;

  constructor(connection: IDatabaseConnection) {
    this.connection = connection;
  }

  async create(_input: SeasoningTypeCreateInput): Promise<CreateResult> {
    return {
      id: 1,
      createdAt: new Date("2024-01-01"),
    };
  }

  async findById(_id: number): Promise<SeasoningType | null> {
    return null;
  }

  async findAll(
    _options?: SeasoningTypeSearchOptions
  ): Promise<PaginatedResult<SeasoningType>> {
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }

  async update(
    _id: number,
    _input: SeasoningTypeUpdateInput
  ): Promise<UpdateResult> {
    return {
      updatedAt: new Date("2024-01-01"),
      affectedRows: 1,
    };
  }

  async delete(_id: number): Promise<DeleteResult> {
    return {
      affectedRows: 1,
    };
  }

  async findByName(_name: string): Promise<SeasoningType[]> {
    return [];
  }

  async existsByName(_name: string, _excludeId?: number): Promise<boolean> {
    return false;
  }

  async count(): Promise<number> {
    return 0;
  }
}

describe("ISeasoningTypeRepository Interface", () => {
  const mockConnection = {} as IDatabaseConnection;
  let repository: ISeasoningTypeRepository;

  beforeEach(() => {
    repository = new MockSeasoningTypeRepository(mockConnection);
  });

  describe("CRUD操作", () => {
    test("create - 調味料種類を作成できる", async () => {
      const input: SeasoningTypeCreateInput = {
        name: "液体調味料",
      };

      const result = await repository.create(input);

      expect(result.id).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("findById - IDで調味料種類を取得できる", async () => {
      const result = await repository.findById(1);

      expect(result).toBeNull();
    });

    test("findAll - 全ての調味料種類を取得できる", async () => {
      const result = await repository.findAll();

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    test("update - 調味料種類を更新できる", async () => {
      const input: SeasoningTypeUpdateInput = {
        name: "新しい液体調味料",
      };

      const result = await repository.update(1, input);

      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.affectedRows).toBe(1);
    });

    test("delete - 調味料種類を削除できる", async () => {
      const result = await repository.delete(1);

      expect(result.affectedRows).toBe(1);
    });
  });

  describe("検索機能", () => {
    test("findByName - 名前で調味料種類を検索できる", async () => {
      const result = await repository.findByName("液体");

      expect(result).toEqual([]);
    });

    test("existsByName - 名前の重複をチェックできる", async () => {
      const result = await repository.existsByName("液体調味料");

      expect(result).toBe(false);
    });

    test("existsByName - 除外IDを指定した重複チェックができる", async () => {
      const result = await repository.existsByName("液体調味料", 1);

      expect(result).toBe(false);
    });
  });

  describe("ユーティリティ機能", () => {
    test("count - 調味料種類の総数を取得できる", async () => {
      const result = await repository.count();

      expect(result).toBe(0);
    });
  });

  describe("検索オプション", () => {
    test("検索文字列付きの検索", async () => {
      const options: SeasoningTypeSearchOptions = {
        search: "液体",
        pagination: { page: 1, limit: 5 },
      };

      const result = await repository.findAll(options);

      expect(result.items).toEqual([]);
    });

    test("ソート付きの検索", async () => {
      const options: SeasoningTypeSearchOptions = {
        sort: { field: "name", direction: "DESC" },
      };

      const result = await repository.findAll(options);

      expect(result.items).toEqual([]);
    });
  });
});
