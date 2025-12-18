/**
 * @fileoverview リソース未発見エラー
 */

import { DomainError } from "./domain-error";

/**
 * リソース未発見エラー
 * 指定されたリソースが存在しない場合に発生
 */
export class NotFoundError extends DomainError {
  constructor(
    public readonly resource: string,
    public readonly id: number | string
  ) {
    super(`${resource} with id ${id} not found`);
  }
}
