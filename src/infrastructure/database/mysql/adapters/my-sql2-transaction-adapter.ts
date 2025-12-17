import type { Connection } from "mysql2/promise";
import type { ITransactionAdapter } from "@/infrastructure/database/interfaces/i-connection-adapter";
import type { QueryResult } from "@/infrastructure/database/interfaces";

/**
 * mysql2 のコネクションをトランザクション操作向けにラップするアダプター
 */
export class MySQL2TransactionAdapter implements ITransactionAdapter {
  constructor(private readonly _connection: Connection) {}

  /**
   * トランザクション内でクエリを実行
   */
  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    const [rows] = await this._connection.execute(sql, params);
    const affectedRows = (rows as { affectedRows?: number })?.affectedRows;

    return {
      rows: (rows as T[]) || [],
      rowsAffected: typeof affectedRows === "number" ? affectedRows : 0,
      insertId: (rows as { insertId?: number })?.insertId || null,
    };
  }

  /**
   * コミット
   */
  async commit(): Promise<void> {
    await this._connection.commit();
  }

  /**
   * ロールバック
   */
  async rollback(): Promise<void> {
    await this._connection.rollback();
  }

  /**
   * 接続終了（トランザクション用の明示クローズ）
   */
  async end(): Promise<void> {
    // プールコネクション互換: release メソッドが存在する場合のみ呼ぶ
    const maybePool = this._connection as unknown as {
      release?: () => Promise<void> | void;
      end?: () => Promise<void> | void;
    };

    if (typeof maybePool.release === "function") {
      await maybePool.release();
      return;
    }

    if (typeof maybePool.end === "function") {
      try {
        await maybePool.end();
      } catch {
        // 既に閉じられている等は握りつぶす
      }
    }
  }
}

export default MySQL2TransactionAdapter;
