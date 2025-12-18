/**
 * @fileoverview 重複エラー
 */

import { DomainError } from "./domain-error";

/**
 * 重複エラー
 * 一意制約違反などで発生
 */
export class DuplicateError extends DomainError {
  constructor(
    public readonly field: string,
    public readonly value: string | number
  ) {
    super(`Duplicate value for ${field}: ${value}`);
  }
}
