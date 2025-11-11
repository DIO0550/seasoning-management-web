/**
 * @fileoverview エラーマッパーのテスト
 */

import { describe, it, expect } from "vitest";
import {
  DomainError,
  ValidationError,
  NotFoundError,
  DuplicateError,
  ForeignKeyViolationError,
} from "@/domain/errors";
import { ErrorMapper } from "../error-mapper";

describe("ErrorMapper", () => {
  const errorMapper = new ErrorMapper();

  describe("toHttpResponse", () => {
    it("NotFoundErrorを404レスポンスに変換する", () => {
      const error = new NotFoundError("Seasoning", 123);
      const response = errorMapper.toHttpResponse(error);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: "NOT_FOUND",
        message: "Seasoning with id 123 not found",
      });
    });

    it("ValidationErrorを400レスポンスに変換する", () => {
      const error = new ValidationError("name", "名前は必須です");
      const response = errorMapper.toHttpResponse(error);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: "VALIDATION_ERROR",
        message: "入力内容を確認してください",
        details: [
          {
            field: "name",
            message: "Validation failed for name: 名前は必須です",
          },
        ],
      });
    });

    it("DuplicateErrorを400レスポンスに変換する", () => {
      const error = new DuplicateError("name", "醤油");
      const response = errorMapper.toHttpResponse(error);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: "DUPLICATE_ERROR",
        message: "Duplicate value for name: 醤油",
      });
    });

    it("ForeignKeyViolationErrorを400レスポンスに変換する", () => {
      const error = new ForeignKeyViolationError("typeId", 999);
      const response = errorMapper.toHttpResponse(error);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: "FOREIGN_KEY_ERROR",
        message: "Foreign key violation for typeId: 999 does not exist",
      });
    });

    it("未知のDomainErrorを500レスポンスに変換する", () => {
      class UnknownDomainError extends DomainError {
        constructor() {
          super("Unknown error");
        }
      }

      const error = new UnknownDomainError();
      const response = errorMapper.toHttpResponse(error);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: "INTERNAL_ERROR",
        message: "システムエラーが発生しました",
      });
    });

    it("一般的なErrorを500レスポンスに変換する", () => {
      const error = new Error("Something went wrong");
      const response = errorMapper.toHttpResponse(error);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: "INTERNAL_ERROR",
        message: "システムエラーが発生しました",
      });
    });

    it("nullやundefinedを500レスポンスに変換する", () => {
      const response1 = errorMapper.toHttpResponse(null);
      const response2 = errorMapper.toHttpResponse(undefined);

      expect(response1.status).toBe(500);
      expect(response1.body.code).toBe("INTERNAL_ERROR");
      expect(response2.status).toBe(500);
      expect(response2.body.code).toBe("INTERNAL_ERROR");
    });
  });
});
