/**
 * データベースクエリ関連の型定義
 */

/**
 * データベースクエリの結果
 */
export interface QueryResult<T = unknown> {
  /** 結果データ */
  rows: T[];
  /** 影響を受けた行数 */
  affectedRows: number;
  /** 挿入されたレコードのID（該当する場合） */
  insertId?: number;
  /** その他のメタデータ */
  metadata?: Record<string, unknown>;
}

/**
 * ページネーション用の共通インターフェース
 */
export interface PaginationOptions {
  /** ページ番号（1から開始） */
  page?: number;
  /** 1ページあたりの件数 */
  limit?: number;
  /** オフセット */
  offset?: number;
}

/**
 * ページネーション結果
 */
export interface PaginatedResult<T> {
  /** データ */
  data: T[];
  /** 総件数 */
  total: number;
  /** 現在のページ */
  page: number;
  /** 1ページあたりの件数 */
  limit: number;
  /** 総ページ数 */
  totalPages: number;
  /** 前のページがあるか */
  hasPrevious: boolean;
  /** 次のページがあるか */
  hasNext: boolean;
}

/**
 * ソートオプション
 */
export interface SortOptions {
  /** ソートするフィールド */
  field: string;
  /** ソート方向 */
  direction: "ASC" | "DESC";
}

/**
 * 検索オプション
 */
export interface SearchOptions extends PaginationOptions {
  /** ソート設定 */
  sort?: SortOptions[];
  /** フィルタ条件 */
  filters?: Record<string, unknown>;
  /** 検索クエリ */
  query?: string;
}
