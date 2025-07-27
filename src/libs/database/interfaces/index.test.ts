import { describe, test, expect } from "vitest";
import {
  // エラー型
  DatabaseError,
  ConnectionError,
  TransactionError,
  QueryError,
  DATABASE_ERROR_CODES,
  // インターフェース（型のみ）
  type IDatabaseConnection,
  type ITransaction,
  type QueryResult,
  type ConnectionConfig,
  type TransactionOptions,
} from "./index";

describe("Database Interfaces Index", () => {
  test("エラー型が正しくエクスポートされている", () => {
    expect(DatabaseError).toBeDefined();
    expect(ConnectionError).toBeDefined();
    expect(TransactionError).toBeDefined();
    expect(QueryError).toBeDefined();
    expect(DATABASE_ERROR_CODES).toBeDefined();
  });

  test("エラークラスが正しく動作する", () => {
    const dbError = new DatabaseError("test error", "TEST_CODE");
    expect(dbError).toBeInstanceOf(Error);
    expect(dbError).toBeInstanceOf(DatabaseError);
    expect(dbError.message).toBe("test error");
    expect(dbError.code).toBe("TEST_CODE");
  });

  test("ConnectionErrorが正しく動作する", () => {
    const connError = new ConnectionError("connection failed", "CONN_FAILED");
    expect(connError).toBeInstanceOf(DatabaseError);
    expect(connError).toBeInstanceOf(ConnectionError);
    expect(connError.name).toBe("ConnectionError");
  });

  test("TransactionErrorが正しく動作する", () => {
    const txError = new TransactionError("transaction failed", "TX_FAILED");
    expect(txError).toBeInstanceOf(DatabaseError);
    expect(txError).toBeInstanceOf(TransactionError);
    expect(txError.name).toBe("TransactionError");
  });

  test("QueryErrorが正しく動作する", () => {
    const queryError = new QueryError(
      "query failed",
      "QUERY_FAILED",
      undefined,
      "SELECT * FROM test"
    );
    expect(queryError).toBeInstanceOf(DatabaseError);
    expect(queryError).toBeInstanceOf(QueryError);
    expect(queryError.name).toBe("QueryError");
    expect(queryError.sql).toBe("SELECT * FROM test");
  });

  test("エラーコード定数が定義されている", () => {
    expect(DATABASE_ERROR_CODES.CONNECTION_FAILED).toBe("CONNECTION_FAILED");
    expect(DATABASE_ERROR_CODES.TRANSACTION_BEGIN_FAILED).toBe(
      "TRANSACTION_BEGIN_FAILED"
    );
    expect(DATABASE_ERROR_CODES.SQL_SYNTAX_ERROR).toBe("SQL_SYNTAX_ERROR");
    expect(DATABASE_ERROR_CODES.UNKNOWN_ERROR).toBe("UNKNOWN_ERROR");
  });

  test("型定義が正しくエクスポートされている", () => {
    // TypeScriptの型チェック用
    // 実際の実行時テストではないが、型の存在確認として有効
    const typeCheck = {
      IDatabaseConnection: null as IDatabaseConnection | null,
      ITransaction: null as ITransaction | null,
      QueryResult: null as QueryResult | null,
      ConnectionConfig: null as ConnectionConfig | null,
      TransactionOptions: null as TransactionOptions | null,
    };

    // 型が正しく定義されていれば、このオブジェクトの作成でエラーは発生しない
    expect(typeCheck).toBeDefined();
  });
});
