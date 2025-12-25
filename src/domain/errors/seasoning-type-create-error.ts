/**
 * @fileoverview 調味料種類の作成失敗エラー
 */

import { DomainError } from "./domain-error";

/**
 * 調味料種類の作成結果が取得できなかった場合に使用するエラー
 */
export class SeasoningTypeCreateError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
