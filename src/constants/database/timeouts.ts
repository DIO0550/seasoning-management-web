/**
 * データベースタイムアウト定数
 * 環境別のデータベースタイムアウト値を管理する
 *
 * @description
 * - 本番環境では長めのタイムアウトで安定性を重視
 * - 開発環境では短めのタイムアウトで開発効率を重視
 * - テスト環境では開発環境と同じ設定を使用
 */

/**
 * データベースタイムアウト設定の型定義
 */
export type DatabaseTimeouts = {
  readonly production: {
    readonly acquireTimeout: number;
    readonly timeout: number;
  };
  readonly development: {
    readonly acquireTimeout: number;
    readonly timeout: number;
  };
  readonly test: {
    readonly acquireTimeout: number;
    readonly timeout: number;
  };
};

/**
 * 本番環境のデータベース取得タイムアウト（ミリ秒）
 * 接続プールから接続を取得する際の最大待機時間
 */
export const PRODUCTION_ACQUIRE_TIMEOUT = 60000;

/**
 * 本番環境のデータベースクエリタイムアウト（ミリ秒）
 * SQLクエリ実行の最大待機時間
 */
export const PRODUCTION_QUERY_TIMEOUT = 60000;

/**
 * 開発環境のデータベース取得タイムアウト（ミリ秒）
 * 開発時の応答性を重視した短めの設定
 */
export const DEVELOPMENT_ACQUIRE_TIMEOUT = 30000;

/**
 * 開発環境のデータベースクエリタイムアウト（ミリ秒）
 * 開発時の応答性を重視した短めの設定
 */
export const DEVELOPMENT_QUERY_TIMEOUT = 30000;

/**
 * テスト環境のデータベース取得タイムアウト（ミリ秒）
 * テスト実行時は開発環境と同じ設定を使用
 */
export const TEST_ACQUIRE_TIMEOUT = DEVELOPMENT_ACQUIRE_TIMEOUT;

/**
 * テスト環境のデータベースクエリタイムアウト（ミリ秒）
 * テスト実行時は開発環境と同じ設定を使用
 */
export const TEST_QUERY_TIMEOUT = DEVELOPMENT_QUERY_TIMEOUT;

/**
 * 環境別データベースタイムアウト設定
 * 各環境のタイムアウト値をまとめて管理
 */
export const DATABASE_TIMEOUTS: DatabaseTimeouts = {
  production: {
    acquireTimeout: PRODUCTION_ACQUIRE_TIMEOUT,
    timeout: PRODUCTION_QUERY_TIMEOUT,
  },
  development: {
    acquireTimeout: DEVELOPMENT_ACQUIRE_TIMEOUT,
    timeout: DEVELOPMENT_QUERY_TIMEOUT,
  },
  test: {
    acquireTimeout: TEST_ACQUIRE_TIMEOUT,
    timeout: TEST_QUERY_TIMEOUT,
  },
} as const;
