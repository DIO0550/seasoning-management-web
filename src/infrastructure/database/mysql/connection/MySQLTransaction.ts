import type * as mysql from "mysql2/promise";
import type { ITransaction } from "../../interfaces/ITransaction";
import type {
  QueryResult,
  TransactionStatus,
} from "@/infrastructure/database/interfaces";
import { TransactionError, QueryError } from "../../errors";

/**
 * MySQL トランザクションの実装
 */
export class MySQLTransaction implements ITransaction {
  private connection: mysql.Connection;
  private status: TransactionStatus = "ACTIVE";

  constructor(connection: mysql.Connection) {
    this.connection = connection;
  }

  /**
   * トランザクション内でSQLクエリを実行する
   */
  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    if (this.status !== "ACTIVE") {
      throw new TransactionError(
        `Cannot execute query on ${this.status.toLowerCase()} transaction`,
        { sql, params, status: this.status }
      );
    }

    try {
      const [rows, fields] = await this.connection.execute(sql, params);
      return this.formatQueryResult<T>(rows, fields);
    } catch (error) {
      this.status = "ERROR";
      throw new QueryError(
        `Transaction query execution failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        sql,
        params,
        { error }
      );
    }
  }

  /**
   * トランザクションをコミットする
   */
  async commit(): Promise<void> {
    if (this.status !== "ACTIVE") {
      throw new TransactionError(
        `Cannot commit ${this.status.toLowerCase()} transaction`,
        { status: this.status }
      );
    }

    try {
      await this.connection.commit();
      this.status = "COMMITTED";
    } catch (error) {
      this.status = "ERROR";
      throw new TransactionError(
        `Transaction commit failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { error }
      );
    }
  }

  /**
   * トランザクションをロールバックする
   */
  async rollback(): Promise<void> {
    if (this.status === "COMMITTED" || this.status === "ROLLED_BACK") {
      throw new TransactionError(
        `Cannot rollback ${this.status.toLowerCase()} transaction`,
        { status: this.status }
      );
    }

    try {
      await this.connection.rollback();
      this.status = "ROLLED_BACK";
    } catch (error) {
      this.status = "ERROR";
      throw new TransactionError(
        `Transaction rollback failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { error }
      );
    }
  }

  /**
   * トランザクションの状態を取得する
   */
  getStatus(): TransactionStatus {
    return this.status;
  }

  /**
   * トランザクションが有効かどうかを確認する
   */
  isActive(): boolean {
    return this.status === "ACTIVE";
  }

  /**
   * クエリ結果をフォーマットする
   */
  private formatQueryResult<T>(
    rows: unknown,
    fields?: unknown
  ): QueryResult<T> {
    // MySQL2の結果を共通のQueryResult形式に変換
    if (Array.isArray(rows)) {
      const mysqlResult = rows as mysql.RowDataPacket[] & mysql.ResultSetHeader;
      return {
        rows: rows as T[],
        rowsAffected: mysqlResult.affectedRows || rows.length,
        insertId: mysqlResult.insertId ?? null,
        metadata: { fields },
      };
    }

    // INSERT/UPDATE/DELETE等の場合
    const result = rows as mysql.ResultSetHeader;
    return {
      rows: [] as T[],
      rowsAffected: result.affectedRows || 0,
      insertId: result.insertId ?? null,
      metadata: { fields },
    };
  }
}
