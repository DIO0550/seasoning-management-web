/**
 * @fileoverview リポジトリ共通型定義
 * 全てのリポジトリインターフェースで使用される共通の型を定義
 */

/**
 * ページネーション設定
 */
export interface PaginationOptions {
  readonly page: number;
  readonly limit: number;
}

/**
 * ページネーション結果
 */
export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

/**
 * ソートオプション
 */
export interface SortOptions {
  readonly field: string;
  readonly direction: "ASC" | "DESC";
}

/**
 * 基本的な検索オプション
 */
export interface BaseSearchOptions {
  readonly pagination?: PaginationOptions;
  readonly sort?: SortOptions;
}

/**
 * 日付範囲検索
 */
export interface DateRangeFilter {
  readonly from?: Date;
  readonly to?: Date;
}

/**
 * リポジトリ操作結果
 */
export interface RepositoryResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

/**
 * 作成結果
 */
export interface CreateResult {
  readonly id: number;
  readonly createdAt: Date;
}

/**
 * 更新結果
 */
export interface UpdateResult {
  readonly updatedAt: Date;
  readonly affectedRows: number;
}

/**
 * 削除結果
 */
export interface DeleteResult {
  readonly affectedRows: number;
}
