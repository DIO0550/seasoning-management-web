/**
 * データベース接続関連の型定義
 */

/**
 * データベース接続設定
 */
export interface ConnectionConfig {
  /** ホスト名 */
  host: string;
  /** ポート番号 */
  port: number;
  /** データベース名 */
  database: string;
  /** ユーザー名 */
  user: string;
  /** パスワード */
  password?: string;
  /** 接続タイムアウト（ミリ秒） */
  connectTimeout?: number;
  /** コネクションプール設定 */
  pool?: PoolConfig;
}

/**
 * コネクションプール設定
 */
export interface PoolConfig {
  /** 最小接続数 */
  min: number;
  /** 最大接続数 */
  max: number;
  /** 取得タイムアウト（ミリ秒） */
  acquireTimeout: number;
  /** 作成タイムアウト（ミリ秒） */
  createTimeout: number;
  /** 破棄タイムアウト（ミリ秒） */
  destroyTimeout: number;
  /** アイドルタイムアウト（ミリ秒） */
  idle: number;
  /** 刈り取り間隔（ミリ秒） */
  reapInterval: number;
}
