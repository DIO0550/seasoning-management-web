import { describe, test, expect } from "vitest";
import { ConnectionError } from "../../../errors/domain/ConnectionError";
import { ErrorCode } from "../../../errors/base/ErrorCode";
import { ErrorSeverity } from "../../../errors/base/ErrorSeverity";

describe("ConnectionError", () => {
  test("接続エラーを作成できる", () => {
    const error = new ConnectionError("データベースに接続できません");

    expect(error.message).toBe("データベースに接続できません");
    expect(error.code).toBe(ErrorCode.CONNECTION_ERROR);
    expect(error.severity).toBe(ErrorSeverity.HIGH);
    expect(error.name).toBe("ConnectionError");
  });

  test("接続情報を保持できる", () => {
    const context = {
      host: "localhost",
      port: 3306,
      database: "seasoning_db",
      attemptCount: 3,
    };

    const error = new ConnectionError("接続に失敗しました", context);

    expect(error.context).toEqual(context);
  });

  test("ネットワークエラーとして分類できる", () => {
    const error = new ConnectionError(
      "ネットワークエラーが発生しました",
      { type: "network" },
      ErrorSeverity.CRITICAL,
      ErrorCode.NETWORK_ERROR
    );

    expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(error.severity).toBe(ErrorSeverity.CRITICAL);
  });
});
