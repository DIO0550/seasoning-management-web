import type { QueryResult } from "@/libs/database/interfaces/IDatabaseConnection";
import type { ITransactionAdapter } from "@/libs/database/interfaces/IConnectionAdapter";
import type { ITransaction } from "@/libs/database/interfaces/ITransaction";

/**
 * MySQLトランザクション実装
 * ITransactionAdapterへの委譲パターンを使用
 */
export class MySQLTransaction implements ITransaction {
  /**
   * トランザクションアダプター
   */
  private readonly _adapter: ITransactionAdapter;

  /**
   * コンストラクタ
   */
  constructor(adapter: ITransactionAdapter) {
    this._adapter = adapter;
  }

  /**
   * トランザクションをコミットする
   */
  async commit(): Promise<void> {
    try {
      await this._adapter.commit();
    } catch (error) {
      throw error;
    }
  }

  /**
   * トランザクションをロールバックする
   */
  async rollback(): Promise<void> {
    try {
      await this._adapter.rollback();
    } catch (error) {
      throw error;
    }
  }

  /**
   * SQLクエリを実行する
   */
  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    try {
      return await this._adapter.query<T>(sql, params);
    } catch (error) {
      throw error;
    }
  }
}
