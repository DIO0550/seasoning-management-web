/**
 * @fileoverview エラーマッパー - Domain例外をHTTPレスポンスに変換
 */

import {
  DomainError,
  ValidationError,
  NotFoundError,
  DuplicateError,
  ForeignKeyViolationError,
} from "@/domain/errors";

/**
 * HTTPエラーレスポンスの型定義
 */
export interface HttpErrorResponse {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * エラーマッピング結果
 */
export interface ErrorMappingResult {
  status: number;
  body: HttpErrorResponse;
}

/**
 * Domain例外をHTTPレスポンスに変換するクラス
 */
export class ErrorMapper {
  /**
   * エラーをHTTPレスポンスに変換
   * @param error エラーオブジェクト
   * @returns HTTPステータスコードとレスポンスボディ
   */
  toHttpResponse(error: unknown): ErrorMappingResult {
    // NotFoundError
    if (error instanceof NotFoundError) {
      return {
        status: 404,
        body: {
          code: "NOT_FOUND",
          message: error.message,
        },
      };
    }

    // ValidationError
    if (error instanceof ValidationError) {
      return {
        status: 400,
        body: {
          code: "VALIDATION_ERROR",
          message: "入力内容を確認してください",
          details: [
            {
              field: error.field,
              message: error.message,
            },
          ],
        },
      };
    }

    // DuplicateError
    if (error instanceof DuplicateError) {
      return {
        status: 409,
        body: {
          code: "DUPLICATE_ERROR",
          message: error.message,
        },
      };
    }

    // ForeignKeyViolationError
    if (error instanceof ForeignKeyViolationError) {
      return {
        status: 400,
        body: {
          code: "FOREIGN_KEY_ERROR",
          message: error.message,
        },
      };
    }

    // その他のDomainError
    if (error instanceof DomainError) {
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "システムエラーが発生しました",
        },
      };
    }

    // 一般的なエラーやnull/undefined
    console.error("Unexpected error:", error);
    return {
      status: 500,
      body: {
        code: "INTERNAL_ERROR",
        message: "システムエラーが発生しました",
      },
    };
  }
}

/**
 * デフォルトエラーマッパーインスタンス
 */
export const errorMapper = new ErrorMapper();
