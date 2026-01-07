/**
 * @fileoverview 調味料削除ユースケースの入出力 DTO を定義するファイル。
 */

/**
 * 調味料削除ユースケースの入力 DTO。
 */
export interface DeleteSeasoningInput {
  /**
   * 削除対象の調味料 ID。
   */
  readonly seasoningId: number;
}
