import type { FieldPacket } from "mysql2/promise";
import type { QueryResult } from "@/libs/database/interfaces/IDatabaseConnection";

/**
 * MySQLクエリ結果に関する型定義
 */

/**
 * mysql2のクエリ結果型
 */
export interface MySQLQueryResult<T = unknown> {
  rows: T[];
  fields: FieldPacket[];
  affectedRows: number;
  insertId: number;
  changedRows: number;
  warningCount: number;
}

/**
 * MySQLQueryResultのコンパニオンオブジェクト
 */
export const MySQLQueryResult = {
  /**
   * mysql2の結果を独自のQueryResultに変換
   */
  toQueryResult<T>(mysqlResult: MySQLQueryResult<T>): QueryResult<T> {
    return {
      rows: mysqlResult.rows,
      rowsAffected: mysqlResult.affectedRows,
      insertId: mysqlResult.insertId === 0 ? null : mysqlResult.insertId,
      metadata: {
        changedRows: mysqlResult.changedRows,
        warningCount: mysqlResult.warningCount,
      },
    };
  },
} as const;
