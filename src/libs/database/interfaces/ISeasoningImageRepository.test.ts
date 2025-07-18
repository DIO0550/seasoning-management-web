/**
 * @fileoverview 調味料画像リポジトリインターフェースのテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect, beforeEach } from "vitest";
import type {
  ISeasoningImageRepository,
  SeasoningImageSearchOptions,
  SeasoningImageCreateInput,
  SeasoningImageUpdateInput,
  ImagePathResult,
} from "./ISeasoningImageRepository";
import type { SeasoningImage } from "../entities/SeasoningImage";
import type {
  PaginatedResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
} from "./common/types";
import type { IDatabaseConnection } from "./IDatabaseConnection";

// モック実装（テスト用）
class MockSeasoningImageRepository implements ISeasoningImageRepository {
  public readonly connection: IDatabaseConnection;

  constructor(connection: IDatabaseConnection) {
    this.connection = connection;
  }

  async create(_input: SeasoningImageCreateInput): Promise<CreateResult> {
    return {
      id: 1,
      createdAt: new Date("2024-01-01"),
    };
  }

  async findById(_id: number): Promise<SeasoningImage | null> {
    return null;
  }

  async findAll(
    _options?: SeasoningImageSearchOptions
  ): Promise<PaginatedResult<SeasoningImage>> {
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
    _input: SeasoningImageUpdateInput
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

  async findByFolderUuid(_folderUuid: string): Promise<SeasoningImage | null> {
    return null;
  }

  generateUuid(): string {
    return "123e4567-e89b-12d3-a456-426614174000";
  }

  generateImagePath(folderUuid: string, filename: string): ImagePathResult {
    return {
      fullPath: `/uploads/${folderUuid}/${filename}`,
      webPath: `/api/images/${folderUuid}/${filename}`,
      absolutePath: `/var/www/uploads/${folderUuid}/${filename}`,
    };
  }

  async existsByFolderUuid(
    _folderUuid: string,
    _excludeId?: number
  ): Promise<boolean> {
    return false;
  }

  async count(): Promise<number> {
    return 0;
  }
}

describe("ISeasoningImageRepository Interface", () => {
  const mockConnection = {} as IDatabaseConnection;
  let repository: ISeasoningImageRepository;

  beforeEach(() => {
    repository = new MockSeasoningImageRepository(mockConnection);
  });

  describe("CRUD操作", () => {
    test("create - 調味料画像を作成できる", async () => {
      const input: SeasoningImageCreateInput = {
        folderUuid: "123e4567-e89b-12d3-a456-426614174000",
        filename: "image.jpg",
      };

      const result = await repository.create(input);

      expect(result.id).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    test("findById - IDで調味料画像を取得できる", async () => {
      const result = await repository.findById(1);

      expect(result).toBeNull();
    });

    test("findAll - 全ての調味料画像を取得できる", async () => {
      const result = await repository.findAll();

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    test("update - 調味料画像を更新できる", async () => {
      const input: SeasoningImageUpdateInput = {
        filename: "new-image.jpg",
      };

      const result = await repository.update(1, input);

      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.affectedRows).toBe(1);
    });

    test("delete - 調味料画像を削除できる", async () => {
      const result = await repository.delete(1);

      expect(result.affectedRows).toBe(1);
    });
  });

  describe("検索機能", () => {
    test("findByFolderUuid - フォルダUUIDで調味料画像を検索できる", async () => {
      const result = await repository.findByFolderUuid(
        "123e4567-e89b-12d3-a456-426614174000"
      );

      expect(result).toBeNull();
    });

    test("existsByFolderUuid - フォルダUUIDの重複をチェックできる", async () => {
      const result = await repository.existsByFolderUuid(
        "123e4567-e89b-12d3-a456-426614174000"
      );

      expect(result).toBe(false);
    });

    test("existsByFolderUuid - 除外IDを指定した重複チェックができる", async () => {
      const result = await repository.existsByFolderUuid(
        "123e4567-e89b-12d3-a456-426614174000",
        1
      );

      expect(result).toBe(false);
    });
  });

  describe("UUID機能", () => {
    test("generateUuid - UUIDを生成できる", () => {
      const uuid = repository.generateUuid();

      expect(uuid).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe("パス生成機能", () => {
    test("generateImagePath - ファイルパスを生成できる", () => {
      const folderUuid = "123e4567-e89b-12d3-a456-426614174000";
      const filename = "test-image.jpg";

      const result = repository.generateImagePath(folderUuid, filename);

      expect(result.fullPath).toBe(`/uploads/${folderUuid}/${filename}`);
      expect(result.webPath).toBe(`/api/images/${folderUuid}/${filename}`);
      expect(result.absolutePath).toBe(
        `/var/www/uploads/${folderUuid}/${filename}`
      );
    });
  });

  describe("ユーティリティ機能", () => {
    test("count - 調味料画像の総数を取得できる", async () => {
      const result = await repository.count();

      expect(result).toBe(0);
    });
  });

  describe("検索オプション", () => {
    test("フォルダUUID指定の検索", async () => {
      const options: SeasoningImageSearchOptions = {
        folderUuid: "123e4567-e89b-12d3-a456-426614174000",
        pagination: { page: 1, limit: 5 },
      };

      const result = await repository.findAll(options);

      expect(result.items).toEqual([]);
    });

    test("ファイル名指定の検索", async () => {
      const options: SeasoningImageSearchOptions = {
        filename: "image.jpg",
        sort: { field: "createdAt", direction: "DESC" },
      };

      const result = await repository.findAll(options);

      expect(result.items).toEqual([]);
    });
  });
});
