/**
 * @fileoverview 調味料 API 向けのエラーコード定義
 */

export const SeasoningApiErrorCodes = Object.freeze({
  validation: "VALIDATION_ERROR",
  internal: "INTERNAL_ERROR",
} as const);

export type SeasoningApiErrorCode =
  (typeof SeasoningApiErrorCodes)[keyof typeof SeasoningApiErrorCodes];
