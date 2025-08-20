import { describe, test, expect, vi, beforeEach } from "vitest";
import { MySQLTransaction } from "./MySQLTransaction";
import type { ITransactionAdapter } from "@/libs/database/interfaces/IConnectionAdapter";
import type { QueryResult } from "@/libs/database/interfaces";

describe("MySQLTransaction", () => {
  let mockAdapter: ITransactionAdapter;
  let transaction: MySQLTransaction;

  beforeEach(() => {
    // ITransactionAdapterのモック
    mockAdapter = {
      query: vi.fn().mockResolvedValue({
        rows: [],
        rowsAffected: 0,
        insertId: null,
      } as QueryResult<unknown>),
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn().mockResolvedValue(undefined),
      end: vi.fn().mockResolvedValue(undefined),
    } as ITransactionAdapter;

    transaction = new MySQLTransaction(mockAdapter);
  });

  describe("commit", () => {
    test("トランザクションをコミットできる", async () => {
      await transaction.commit();

      expect(mockAdapter.commit).toHaveBeenCalledOnce();
    });

    test("アダプターでエラーが発生した場合は適切にハンドルされる", async () => {
      const error = new Error("Commit failed");
      mockAdapter.commit = vi.fn().mockRejectedValue(error);

      await expect(transaction.commit()).rejects.toThrow("Commit failed");
    });
  });

  describe("rollback", () => {
    test("トランザクションをロールバックできる", async () => {
      await transaction.rollback();

      expect(mockAdapter.rollback).toHaveBeenCalledOnce();
    });

    test("アダプターでエラーが発生した場合は適切にハンドルされる", async () => {
      const error = new Error("Rollback failed");
      mockAdapter.rollback = vi.fn().mockRejectedValue(error);

      await expect(transaction.rollback()).rejects.toThrow("Rollback failed");
    });
  });

  describe("query", () => {
    test("SQLクエリを実行できる", async () => {
      const mockResult: QueryResult<{ id: number }> = {
        rows: [{ id: 1 }],
        rowsAffected: 1,
        insertId: 1,
      };
      mockAdapter.query = vi.fn().mockResolvedValue(mockResult);

      const result = await transaction.query<{ id: number }>(
        "SELECT * FROM test WHERE id = ?",
        [1]
      );

      expect(mockAdapter.query).toHaveBeenCalledWith(
        "SELECT * FROM test WHERE id = ?",
        [1]
      );
      expect(result).toEqual(mockResult);
    });

    test("パラメータなしでクエリを実行できる", async () => {
      const mockResult: QueryResult<unknown> = {
        rows: [],
        rowsAffected: 0,
        insertId: null,
      };
      mockAdapter.query = vi.fn().mockResolvedValue(mockResult);

      const result = await transaction.query("SELECT 1");

      expect(mockAdapter.query).toHaveBeenCalledWith("SELECT 1", undefined);
      expect(result).toEqual(mockResult);
    });

    test("クエリでエラーが発生した場合は適切にハンドルされる", async () => {
      const error = new Error("Query failed");
      mockAdapter.query = vi.fn().mockRejectedValue(error);

      await expect(
        transaction.query("SELECT * FROM invalid_table")
      ).rejects.toThrow("Query failed");
    });
  });

  describe("委譲パターンの動作確認", () => {
    test("すべてのメソッドがアダプターに正しく委譲される", async () => {
      // commit
      await transaction.commit();
      expect(mockAdapter.commit).toHaveBeenCalledOnce();

      // rollback
      await transaction.rollback();
      expect(mockAdapter.rollback).toHaveBeenCalledOnce();

      // query
      await transaction.query("SELECT 1", []);
      expect(mockAdapter.query).toHaveBeenCalledWith("SELECT 1", []);
    });
  });
});
