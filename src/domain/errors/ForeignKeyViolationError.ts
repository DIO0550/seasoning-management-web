/**
 * @fileoverview 外部キー制約違反エラー
 */

import { DomainError } from "./DomainError";

/**
 * 外部キー制約違反エラー
 * 参照先のリソースが存在しない場合に発生
 */
export class ForeignKeyViolationError extends DomainError {
  constructor(
    public readonly field: string,
    public readonly value: number | string
  ) {
    super(`Foreign key violation for ${field}: ${value} does not exist`);
  }
}
