/**
 * ページネーション関連の定数定義
 *
 * プロジェクト全体で使用されるページネーション設定の統一管理を目的とする。
 * マジックナンバーの排除と設定の一元管理により、保守性を向上させる。
 */

/**
 * デフォルトのページサイズ
 * 一般的なリスト表示で使用される標準的なページサイズ
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * デフォルトのページ番号
 * ページネーション開始時の初期ページ
 */
export const DEFAULT_PAGE_NUMBER = 1;

/**
 * 最小ページ番号
 * ページネーションで指定可能な最小値
 */
export const MIN_PAGE_NUMBER = 1;

/**
 * 最小ページサイズ
 * 1ページあたりの最小表示件数
 */
export const MIN_PAGE_SIZE = 1;

/**
 * 最大ページサイズ
 * パフォーマンスを考慮した1ページあたりの最大表示件数
 */
export const MAX_PAGE_SIZE = 100;

/**
 * 調味料一覧のページサイズ
 * 調味料リストで使用される専用のページサイズ
 */
export const SEASONING_PAGE_SIZE = 10;

/**
 * 調味料画像一覧のページサイズ
 * 調味料画像リストで使用される専用のページサイズ
 */
export const SEASONING_IMAGE_PAGE_SIZE = 20;

/**
 * 調味料種類一覧のページサイズ
 * 調味料種類リストで使用される専用のページサイズ
 */
export const SEASONING_TYPE_PAGE_SIZE = 50;

/**
 * ページ番号とページサイズからオフセット値を計算する
 *
 * @param page - ページ番号（1から開始）
 * @param pageSize - 1ページあたりの件数
 * @returns データベースクエリで使用するオフセット値
 *
 * @example
 * ```typescript
 * // 1ページ目、10件表示の場合
 * calculateOffset(1, 10); // => 0
 *
 * // 2ページ目、10件表示の場合
 * calculateOffset(2, 10); // => 10
 *
 * // 3ページ目、20件表示の場合
 * calculateOffset(3, 20); // => 40
 * ```
 */
export const calculateOffset = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};

/**
 * ページネーション設定の型定義
 */
export interface PaginationConfig {
  /** ページ番号（1から開始） */
  readonly page: number;
  /** 1ページあたりの件数 */
  readonly pageSize: number;
}

/**
 * ページネーション結果の型定義
 */
export interface PaginationResult {
  /** 現在のページ番号 */
  readonly currentPage: number;
  /** 1ページあたりの件数 */
  readonly pageSize: number;
  /** 総件数 */
  readonly totalCount: number;
  /** 総ページ数 */
  readonly totalPages: number;
  /** 前のページが存在するか */
  readonly hasPrevious: boolean;
  /** 次のページが存在するか */
  readonly hasNext: boolean;
}
