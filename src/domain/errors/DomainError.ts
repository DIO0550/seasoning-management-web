/**
 * @fileoverview ドメイン例外の基底クラス
 */

/**
 * ドメイン層で発生する全ての例外の基底クラス
 * アプリケーション固有のビジネスロジックエラーを表現する
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // スタックトレースを正しく保持
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
