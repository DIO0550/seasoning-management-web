import { describe, test, expect } from "vitest";
import { MySQLErrorMapper } from "../../../errors/mapping/my-sql-error-mapper";
import { ValidationError } from "../../../errors/domain/validation-error";
import { ConflictError } from "../../../errors/domain/conflict-error";
import { ConnectionError } from "../../../errors/domain/connection-error";
import { NotFoundError } from "../../../errors/domain/not-found-error";
import { DatabaseError } from "../../../errors/base/database-error";
import { ErrorCode } from "../../../errors/base/error-code";
import { MySQLError } from "../../../errors/mapping/error-context";

describe("my-sql-error-mapper", () => {
  test("MySQL重複キーエラーをConflictErrorにマップできる", () => {
    const mysqlError: MySQLError = new Error(
      "Duplicate entry 'test@example.com' for key 'email'"
    ) as MySQLError;
    mysqlError.code = "ER_DUP_ENTRY";
    mysqlError.errno = 1062;

    const mappedError = MySQLErrorMapper.mapError(mysqlError);

    expect(mappedError).toBeInstanceOf(ConflictError);
    expect(mappedError.code).toBe(ErrorCode.DUPLICATE_KEY);
    expect(mappedError.message).toContain("重複するデータが存在します");
  });

  test("MySQL接続エラーをConnectionErrorにマップできる", () => {
    const mysqlError: MySQLError = new Error(
      "Connection lost: The server closed the connection"
    ) as MySQLError;
    mysqlError.code = "PROTOCOL_CONNECTION_LOST";

    const mappedError = MySQLErrorMapper.mapError(mysqlError);

    expect(mappedError).toBeInstanceOf(ConnectionError);
    expect(mappedError.code).toBe(ErrorCode.CONNECTION_ERROR);
  });

  test("MySQL制約違反エラーをValidationErrorにマップできる", () => {
    const mysqlError: MySQLError = new Error(
      "Column 'name' cannot be null"
    ) as MySQLError;
    mysqlError.code = "ER_BAD_NULL_ERROR";
    mysqlError.errno = 1048;

    const mappedError = MySQLErrorMapper.mapError(mysqlError);

    expect(mappedError).toBeInstanceOf(ValidationError);
    expect(mappedError.code).toBe(ErrorCode.VALIDATION_ERROR);
  });

  test("MySQLテーブル不存在エラーをNotFoundErrorにマップできる", () => {
    const mysqlError: MySQLError = new Error(
      "Table 'test.nonexistent_table' doesn't exist"
    ) as MySQLError;
    mysqlError.code = "ER_NO_SUCH_TABLE";
    mysqlError.errno = 1146;

    const mappedError = MySQLErrorMapper.mapError(mysqlError);

    expect(mappedError).toBeInstanceOf(NotFoundError);
    expect(mappedError.code).toBe(ErrorCode.NOT_FOUND);
  });

  test("未知のMySQLエラーを汎用DatabaseErrorにマップできる", () => {
    const mysqlError: MySQLError = new Error(
      "Unknown MySQL error"
    ) as MySQLError;
    mysqlError.code = "ER_UNKNOWN";

    const mappedError = MySQLErrorMapper.mapError(mysqlError);

    expect(mappedError).toBeInstanceOf(DatabaseError);
    expect(mappedError.code).toBe(ErrorCode.UNKNOWN_ERROR);
  });

  test("エラーコンテキスト情報を保持する", () => {
    const mysqlError: MySQLError = new Error("Duplicate entry") as MySQLError;
    mysqlError.code = "ER_DUP_ENTRY";
    mysqlError.errno = 1062;
    mysqlError.sqlState = "23000";

    const context = { table: "users", operation: "INSERT" };
    const mappedError = MySQLErrorMapper.mapError(mysqlError, context);

    expect(mappedError.context).toEqual({
      ...context,
      originalError: {
        code: "ER_DUP_ENTRY",
        errno: 1062,
        sqlState: "23000",
        message: "Duplicate entry",
      },
    });
  });

  test("非MySQLエラーをそのまま処理する", () => {
    const genericError = new Error("Generic error");

    const mappedError = MySQLErrorMapper.mapError(genericError);

    expect(mappedError).toBeInstanceOf(DatabaseError);
    expect(mappedError.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(mappedError.message).toBe("Generic error");
  });
});
