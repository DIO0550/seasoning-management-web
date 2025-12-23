/**
 * @fileoverview 調味料取得ユースケースで利用する入出力 DTO を定義するファイル。
 */

import type { ExpiryStatus } from "@/domain/entities/seasoning/seasoning";

/**
 * 調味料取得ユースケースの入力 DTO。
 */
export interface GetSeasoningInput {
  /**
   * 取得対象の調味料 ID。
   */
  readonly seasoningId: number;
}

/**
 * 調味料取得ユースケースの出力 DTO。
 */
export interface GetSeasoningOutput {
  /**
   * 調味料 ID。
   */
  readonly id: number;
  /**
   * 調味料名。
   */
  readonly name: string;
  /**
   * 調味料種類 ID（`seasoning_type.id`）。
   */
  readonly typeId: number;
  /**
   * 調味料画像 ID（`seasoning_image.id`）。画像がない場合は `null`。
   */
  readonly imageId: number | null;
  /**
   * 消費期限の日付文字列（`seasoning.best_before_at`）。
   * YYYY-MM-DD形式（例: `"2025-01-31"`）。値が存在しない場合は `null`。
   */
  readonly bestBeforeAt: string | null;
  /**
   * 賞味期限の日付文字列（`seasoning.expires_at`）。
   * YYYY-MM-DD形式（例: `"2025-01-31"`）。値が存在しない場合は `null`。
   */
  readonly expiresAt: string | null;
  /**
   * 購入日の日付文字列（`seasoning.purchased_at`）。
   * YYYY-MM-DD形式（例: `"2025-01-31"`）。値が存在しない場合は `null`。
   */
  readonly purchasedAt: string | null;
  /**
   * レコードの登録日時文字列（`seasoning.created_at`）。
   * ISO 8601 形式の日時文字列（例: `"2025-01-31T12:34:56.789Z"`）。
   */
  readonly createdAt: string;
  /**
   * レコードの更新日時文字列（`seasoning.updated_at`）。
   * ISO 8601 形式の日時文字列（例: `"2025-01-31T12:34:56.789Z"`）。
   */
  readonly updatedAt: string;
  /**
   * 調味料の期限状態。
   */
  readonly expiryStatus: ExpiryStatus;
  /**
   * 今日から期限日までの日数。
   * 期限が設定されていない場合は `null`。
   */
  readonly daysUntilExpiry: number | null;
}
