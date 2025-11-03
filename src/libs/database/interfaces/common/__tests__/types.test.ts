/**
 * @fileoverview リポジトリ共通型のテスト
 * TDD（Test-Driven Development）で実装
 */

import { describe, test, expect } from "vitest";
import type {
  PaginationOptions,
  PaginatedResult,
  SortOptions,
  BaseSearchOptions,
  DateRangeFilter,
  RepositoryResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
} from "../types";

describe("Repository Common Types", () => {
  describe("PaginationOptions", () => {
    test("有効なページネーションオプションの型チェック", () => {
      const paginationOptions: PaginationOptions = {
        page: 1,
        limit: 10,
      };

      expect(paginationOptions.page).toBe(1);
      expect(paginationOptions.limit).toBe(10);
    });
  });

  describe("PaginatedResult", () => {
    test("有効なページネーション結果の型チェック", () => {
      const paginatedResult: PaginatedResult<string> = {
        items: ["item1", "item2"],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      expect(paginatedResult.items).toHaveLength(2);
      expect(paginatedResult.total).toBe(2);
      expect(paginatedResult.totalPages).toBe(1);
    });
  });

  describe("SortOptions", () => {
    test("昇順ソートオプションの型チェック", () => {
      const sortOptions: SortOptions = {
        field: "name",
        direction: "ASC",
      };

      expect(sortOptions.field).toBe("name");
      expect(sortOptions.direction).toBe("ASC");
    });

    test("降順ソートオプションの型チェック", () => {
      const sortOptions: SortOptions = {
        field: "createdAt",
        direction: "DESC",
      };

      expect(sortOptions.field).toBe("createdAt");
      expect(sortOptions.direction).toBe("DESC");
    });
  });

  describe("BaseSearchOptions", () => {
    test("ページネーションとソートを含む検索オプションの型チェック", () => {
      const searchOptions: BaseSearchOptions = {
        pagination: {
          page: 1,
          limit: 20,
        },
        sort: {
          field: "name",
          direction: "ASC",
        },
      };

      expect(searchOptions.pagination?.page).toBe(1);
      expect(searchOptions.sort?.field).toBe("name");
    });

    test("オプション項目なしの検索オプションの型チェック", () => {
      const searchOptions: BaseSearchOptions = {};

      expect(searchOptions.pagination).toBeUndefined();
      expect(searchOptions.sort).toBeUndefined();
    });
  });

  describe("DateRangeFilter", () => {
    test("開始日と終了日を含む日付範囲フィルタの型チェック", () => {
      const dateRange: DateRangeFilter = {
        from: new Date("2024-01-01"),
        to: new Date("2024-12-31"),
      };

      expect(dateRange.from).toBeInstanceOf(Date);
      expect(dateRange.to).toBeInstanceOf(Date);
    });

    test("部分的な日付範囲フィルタの型チェック", () => {
      const dateRangeFrom: DateRangeFilter = {
        from: new Date("2024-01-01"),
      };

      const dateRangeTo: DateRangeFilter = {
        to: new Date("2024-12-31"),
      };

      expect(dateRangeFrom.from).toBeInstanceOf(Date);
      expect(dateRangeFrom.to).toBeUndefined();
      expect(dateRangeTo.from).toBeUndefined();
      expect(dateRangeTo.to).toBeInstanceOf(Date);
    });
  });

  describe("RepositoryResult", () => {
    test("成功結果の型チェック", () => {
      const successResult: RepositoryResult<string> = {
        success: true,
        data: "test data",
      };

      expect(successResult.success).toBe(true);
      expect(successResult.data).toBe("test data");
      expect(successResult.error).toBeUndefined();
    });

    test("失敗結果の型チェック", () => {
      const errorResult: RepositoryResult<string> = {
        success: false,
        error: "Something went wrong",
      };

      expect(errorResult.success).toBe(false);
      expect(errorResult.error).toBe("Something went wrong");
      expect(errorResult.data).toBeUndefined();
    });
  });

  describe("CreateResult", () => {
    test("作成結果の型チェック", () => {
      const createResult: CreateResult = {
        id: 1,
        createdAt: new Date("2024-01-01"),
      };

      expect(createResult.id).toBe(1);
      expect(createResult.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("UpdateResult", () => {
    test("更新結果の型チェック", () => {
      const updateResult: UpdateResult = {
        updatedAt: new Date("2024-01-01"),
        affectedRows: 1,
      };

      expect(updateResult.updatedAt).toBeInstanceOf(Date);
      expect(updateResult.affectedRows).toBe(1);
    });
  });

  describe("DeleteResult", () => {
    test("削除結果の型チェック", () => {
      const deleteResult: DeleteResult = {
        affectedRows: 1,
      };

      expect(deleteResult.affectedRows).toBe(1);
    });
  });
});
