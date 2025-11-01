import { describe, test, expect } from "vitest";
import type { ITransaction } from "../ITransaction";
import type {
  QueryResult,
  TransactionStatus,
} from "../IDatabaseConnection";

// テスト用のモック実装
class MockTransaction implements ITransaction {
  private _isCommitted = false;
  private _isRolledBack = false;
  private _status: TransactionStatus = "ACTIVE";

  async query<T = unknown>(
    _sql: string,
    _params?: unknown[]
  ): Promise<QueryResult<T>> {
    if (this._status !== "ACTIVE") {
      throw new Error("Transaction is not active");
    }
    return {
      rows: [] as T[],
      rowsAffected: 0,
      insertId: null,
      metadata: {},
    };
  }

  async commit(): Promise<void> {
    if (this._isRolledBack) {
      throw new Error("Transaction has been rolled back");
    }
    if (this._isCommitted) {
      throw new Error("Transaction has already been committed");
    }
    this._isCommitted = true;
    this._status = "COMMITTED";
  }

  async rollback(): Promise<void> {
    if (this._isCommitted) {
      throw new Error("Transaction has been committed");
    }
    if (this._isRolledBack) {
      throw new Error("Transaction has already been rolled back");
    }
    this._isRolledBack = true;
    this._status = "ROLLED_BACK";
  }

  // テスト用のヘルパーメソッド
  get isCommitted(): boolean {
    return this._isCommitted;
  }

  get isRolledBack(): boolean {
    return this._isRolledBack;
  }

  getStatus(): TransactionStatus {
    return this._status;
  }

  isActive(): boolean {
    return this._status === "ACTIVE";
  }
}

describe("ITransaction", () => {
  test("queryメソッドが呼び出せる", async () => {
    const transaction = new MockTransaction();

    const result = await transaction.query("SELECT 1");

    expect(result).toBeDefined();
    expect(result.rows).toEqual([]);
    expect(result.rowsAffected).toBe(0);
  });

  test("トランザクションをコミットできる", async () => {
    const transaction = new MockTransaction();

    await transaction.commit();

    expect(transaction.isCommitted).toBe(true);
  });

  test("トランザクションをロールバックできる", async () => {
    const transaction = new MockTransaction();

    await transaction.rollback();

    expect(transaction.isRolledBack).toBe(true);
  });

  test("コミット後のクエリはエラーになる", async () => {
    const transaction = new MockTransaction();

    await transaction.commit();

    await expect(transaction.query("SELECT 1")).rejects.toThrow(
      "Transaction is not active"
    );
  });

  test("ロールバック後のクエリはエラーになる", async () => {
    const transaction = new MockTransaction();

    await transaction.rollback();

    await expect(transaction.query("SELECT 1")).rejects.toThrow(
      "Transaction is not active"
    );
  });

  test("二重コミットはエラーになる", async () => {
    const transaction = new MockTransaction();

    await transaction.commit();

    await expect(transaction.commit()).rejects.toThrow(
      "Transaction has already been committed"
    );
  });

  test("二重ロールバックはエラーになる", async () => {
    const transaction = new MockTransaction();

    await transaction.rollback();

    await expect(transaction.rollback()).rejects.toThrow(
      "Transaction has already been rolled back"
    );
  });

  test("コミット後のロールバックはエラーになる", async () => {
    const transaction = new MockTransaction();

    await transaction.commit();

    await expect(transaction.rollback()).rejects.toThrow(
      "Transaction has been committed"
    );
  });

  test("ロールバック後のコミットはエラーになる", async () => {
    const transaction = new MockTransaction();

    await transaction.rollback();

    await expect(transaction.commit()).rejects.toThrow(
      "Transaction has been rolled back"
    );
  });
});
