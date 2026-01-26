/**
 * @fileoverview 競合エラー
 */

import { DomainError } from "./domain-error";

/**
 * 競合エラー
 * 関連データが存在するために処理できない場合に使用
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
