/**
 * @fileoverview 調味料テンプレートリポジトリインターフェースのテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect, beforeEach } from "vitest";
import type {
  ISeasoningTemplateRepository,
  SeasoningTemplateSearchOptions,
  SeasoningTemplateCreateInput,
  SeasoningTemplateUpdateInput,
  CreateSeasoningFromTemplateInput,
} from "../i-seasoning-template-repository";
import type { SeasoningTemplate } from "../../../entities/seasoning-template";
import type {
  PaginatedResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
} from "../../common/types";
import type { IDatabaseConnection } from "../../core/i-database-connection";

// モック実装（テスト用）
class MockSeasoningTemplateRepository implements ISeasoningTemplateRepository {
  public readonly connection: IDatabaseConnection;

  constructor(connection: IDatabaseConnection) {
    this.connection = connection;
  }

  async create(_input: SeasoningTemplateCreateInput): Promise<CreateResult> {
    return {
      id: 1,
      createdAt: new Date("2024-01-01"),
    };
  }

  async findById(_id: number): Promise<SeasoningTemplate | null> {
    return null;
  }

  async findAll(
    _options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>> {
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
    _input: SeasoningTemplateUpdateInput
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

  async findByName(_name: string): Promise<SeasoningTemplate[]> {
    return [];
  }

  async findByTypeId(
    _typeId: number,
    _options?: SeasoningTemplateSearchOptions
  ): Promise<PaginatedResult<SeasoningTemplate>> {
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }

  async createSeasoningFromTemplate(
    _input: CreateSeasoningFromTemplateInput
  ): Promise<CreateResult> {
    return {
      id: 1,
      createdAt: new Date("2024-01-01"),
    };
  }

  async existsByName(_name: string, _excludeId?: number): Promise<boolean> {
    return false;
  }

  async count(): Promise<number> {
    return 0;
  }
}

describe("ISeasoningTemplateRepository Interface", () => {
  const mockConnection = {} as IDatabaseConnection;
  let repository: ISeasoningTemplateRepository;

  beforeEach(() => {
    repository = new MockSeasoningTemplateRepository(mockConnection);
  });

  describe("CRUD操作", () => {
    test("create - 調味料テンプレートを作成できる", async () => {
      const input: SeasoningTemplateCreateInput = {
        name: "和食基本セット",
        typeId: 1,
        imageId: 2,
      };

      const result = await repository.create(input);

      expect(result.id).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("findById - IDで調味料テンプレートを取得できる", async () => {
      const result = await repository.findById(1);

      expect(result).toBeNull();
    });

    test("findAll - 全ての調味料テンプレートを取得できる", async () => {
      const result = await repository.findAll();

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    test("update - 調味料テンプレートを更新できる", async () => {
      const input: SeasoningTemplateUpdateInput = {
        name: "新しい和食基本セット",
        imageId: null,
      };

      const result = await repository.update(1, input);

      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.affectedRows).toBe(1);
    });

    test("delete - 調味料テンプレートを削除できる", async () => {
      const result = await repository.delete(1);

      expect(result.affectedRows).toBe(1);
    });
  });

  describe("検索機能", () => {
    test("findByName - 名前で調味料テンプレートを検索できる", async () => {
      const result = await repository.findByName("和食");

      expect(result).toEqual([]);
    });

    test("findByTypeId - 種類IDで調味料テンプレートを検索できる", async () => {
      const options: SeasoningTemplateSearchOptions = {
        pagination: { page: 1, limit: 5 },
      };

      const result = await repository.findByTypeId(1, options);

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    test("existsByName - 名前の重複をチェックできる", async () => {
      const result = await repository.existsByName("和食基本セット");

      expect(result).toBe(false);
    });

    test("existsByName - 除外IDを指定した重複チェックができる", async () => {
      const result = await repository.existsByName("和食基本セット", 1);

      expect(result).toBe(false);
    });
  });

  describe("テンプレートから調味料作成機能", () => {
    test("createSeasoningFromTemplate - テンプレートから調味料を作成できる", async () => {
      const input: CreateSeasoningFromTemplateInput = {
        templateId: 1,
        bestBeforeAt: new Date("2024-12-31"),
        expiresAt: new Date("2024-06-30"),
        purchasedAt: new Date("2024-01-01"),
      };

      const result = await repository.createSeasoningFromTemplate(input);

      expect(result.id).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("createSeasoningFromTemplate - 期限なしでも調味料を作成できる", async () => {
      const input: CreateSeasoningFromTemplateInput = {
        templateId: 1,
      };

      const result = await repository.createSeasoningFromTemplate(input);

      expect(result.id).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("ユーティリティ機能", () => {
    test("count - 調味料テンプレートの総数を取得できる", async () => {
      const result = await repository.count();

      expect(result).toBe(0);
    });
  });

  describe("検索オプション", () => {
    test("検索文字列付きの検索", async () => {
      const options: SeasoningTemplateSearchOptions = {
        search: "和食",
        pagination: { page: 1, limit: 5 },
      };

      const result = await repository.findAll(options);

      expect(result.items).toEqual([]);
    });

    test("種類ID指定の検索", async () => {
      const options: SeasoningTemplateSearchOptions = {
        typeId: 1,
        sort: { field: "name", direction: "ASC" },
      };

      const result = await repository.findAll(options);

      expect(result.items).toEqual([]);
    });

    test("画像有無指定の検索", async () => {
      const options: SeasoningTemplateSearchOptions = {
        hasImage: true,
      };

      const result = await repository.findAll(options);

      expect(result.items).toEqual([]);
    });
  });
});
