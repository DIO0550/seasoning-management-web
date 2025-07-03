/**
 * 調味料関連のページパス定数
 */
export const SEASONING_PAGE_PATHS = {
  /** 調味料一覧ページ */
  LIST: "/seasoning/list",
  /** 調味料追加ページ */
  ADD: "/seasoning/add",
} as const;

/**
 * 調味料ページパスの型定義
 */
export type SeasoningPagePath =
  (typeof SEASONING_PAGE_PATHS)[keyof typeof SEASONING_PAGE_PATHS];
