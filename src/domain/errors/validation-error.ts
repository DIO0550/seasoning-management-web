/**
 * @fileoverview バリデーションエラー
 */

import { DomainError } from "./domain-error";

/**
 * バリデーションエラー
 * ドメインルールに違反した場合に発生
 */
export class ValidationError extends DomainError {
  constructor(public readonly field: string, message: string) {
    super(`Validation failed for ${field}: ${message}`);
  }
}
