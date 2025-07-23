/**
 * データベース接続制限定数
 * 環境別のデータベース接続プール数を管理する
 *
 * @description
 * - 本番環境では高い接続数で安定性を重視
 * - 開発環境では中程度の接続数でバランスを重視
 * - テスト環境では最小限の接続数でリソース効率を重視
 */

/**
 * データベース接続プール数の型定義
 */
export type ConnectionLimits = {
  readonly production: number;
  readonly development: number;
  readonly test: number;
};

/**
 * 本番環境のデータベース接続プール数
 * 高トラフィックに対応するため多めの接続数を設定
 */
export const PRODUCTION_CONNECTION_LIMIT = 10 as const;

/**
 * 開発環境のデータベース接続プール数
 * 開発作業に必要十分な接続数を設定
 */
export const DEVELOPMENT_CONNECTION_LIMIT = 5 as const;

/**
 * テスト環境のデータベース接続プール数
 * テスト実行時のリソース消費を最小化するため少なめの接続数を設定
 */
export const TEST_CONNECTION_LIMIT = 3 as const;

/**
 * 環境別データベース接続制限設定
 * 各環境の接続プール数をまとめて管理
 */
export const CONNECTION_LIMITS: ConnectionLimits = {
  production: PRODUCTION_CONNECTION_LIMIT,
  development: DEVELOPMENT_CONNECTION_LIMIT,
  test: TEST_CONNECTION_LIMIT,
} as const;
