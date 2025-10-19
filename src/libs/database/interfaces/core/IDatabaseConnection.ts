import type { ITransaction } from "./ITransaction";

/**
 * データベース接続のインターフェース
 * クリーンアーキテクチャに基づき、具体的なDB実装に依存しない抽象的な接続操作を定義
 */
export interface IDatabaseConnection {
  /**
   * データベースに接続する
   * @throws {ConnectionError} 接続に失敗した場合
   */
  connect(): Promise<void>;

  /**
   * データベースから切断する
   * @throws {ConnectionError} 切断に失敗した場合
   */
  disconnect(): Promise<void>;

  /**
   * 接続状態を確認する
   * @returns 接続されている場合はtrue
   */
  isConnected(): boolean;

  /**
   * SQLクエリを実行する
   * @param sql 実行するSQL文
   * @param params クエリパラメータ
   * @returns クエリ結果
   * @throws {QueryError} クエリ実行に失敗した場合
   */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;

  /**
   * トランザクションを開始する
   * @param options トランザクションオプション
   * @returns トランザクションオブジェクト
   * @throws {TransactionError} トランザクション開始に失敗した場合
   */
  beginTransaction(options?: TransactionOptions): Promise<ITransaction>;

  /**
   * データベース接続の生存確認を行う
   * @returns 接続が生きている場合はtrue
   */
  ping(): Promise<boolean>;

  /**
   * 接続設定を取得する
   * @returns 接続設定のコピー
   */
  getConfig(): ConnectionConfig;
}

/**
 * クエリ実行結果
 */
export interface QueryResult<T = unknown> {
  /**
   * 取得された行データ
   */
  rows: T[];

  /**
   * 影響を受けた行数
   */
  rowsAffected: number;

  /**
   * 挿入されたレコードのID（INSERT操作の場合）
   */
  insertId: number | null;

  /**
   * 追加のメタデータ（必要に応じて）
   */
  metadata?: Record<string, unknown>;
}

/**
 * QueryResultのコンパニオンオブジェクト
 */
export const QueryResult = {
  /**
   * 空のQueryResultを作成
   */
  empty<T = unknown>(): QueryResult<T> {
    return {
      rows: [],
      rowsAffected: 0,
      insertId: null,
    };
  },

  /**
   * MySQL結果からQueryResultを作成
   */
  fromMySQL<T = unknown>(mysqlResult: {
    rows: T[];
    affectedRows: number;
    insertId: number;
    changedRows: number;
    warningCount: number;
  }): QueryResult<T> {
    return {
      rows: mysqlResult.rows,
      rowsAffected: mysqlResult.affectedRows,
      insertId: mysqlResult.insertId === 0 ? null : mysqlResult.insertId,
      metadata: {
        changedRows: mysqlResult.changedRows,
        warningCount: mysqlResult.warningCount,
      },
    };
  },
} as const;

/**
 * データベース接続設定
 */
export interface ConnectionConfig {
  /**
   * データベースホスト
   */
  host: string;

  /**
   * データベースポート
   */
  port: number;

  /**
   * データベース名
   */
  database: string;

  /**
   * ユーザー名
   */
  username: string;

  /**
   * パスワード
   */
  password?: string;

  /**
   * 接続タイムアウト（ミリ秒）
   */
  connectTimeout?: number;

  /**
   * クエリタイムアウト（ミリ秒）
   */
  queryTimeout?: number;

  /**
   * 接続プールの最大サイズ
   */
  maxConnections?: number;

  /**
   * 接続プールの最小サイズ
   */
  minConnections?: number;

  /**
   * SSL設定
   */
  ssl?:
    | boolean
    | {
        ca?: string;
        cert?: string;
        key?: string;
        rejectUnauthorized?: boolean;
      };

  /**
   * プール設定（利用する場合）
   */
  pool?: Partial<PoolConfig>;

  /**
   * 追加オプション
   */
  options?: Record<string, unknown>;
}

/**
 * コネクションプール設定
 */
export interface PoolConfig {
  /**
   * 最小接続数
   */
  min: number;

  /**
   * 最大接続数
   */
  max: number;

  /**
   * 取得タイムアウト（ミリ秒）
   */
  acquireTimeout: number;

  /**
   * 作成タイムアウト（ミリ秒）
   */
  createTimeout: number;

  /**
   * 破棄タイムアウト（ミリ秒）
   */
  destroyTimeout: number;

  /**
   * アイドルタイムアウト（ミリ秒）
   */
  idle: number;

  /**
   * 刈り取り間隔（ミリ秒）
   */
  reapInterval: number;
}

/**
 * 接続プールのインターフェース
 */
export interface IConnectionPool {
  /**
   * プールから接続を取得する
   */
  getConnection(): Promise<IDatabaseConnection>;

  /**
   * 接続をプールに返却する
   */
  releaseConnection(connection: IDatabaseConnection): Promise<void>;

  /**
   * プールを閉じる
   */
  close(): Promise<void>;

  /**
   * プールの統計情報を取得する
   */
  getStats(): PoolStats;
}

/**
 * 接続プールの統計情報
 */
export interface PoolStats {
  /**
   * 総接続数
   */
  totalConnections: number;

  /**
   * アクティブな接続数
   */
  activeConnections: number;

  /**
   * アイドル状態の接続数
   */
  idleConnections: number;

  /**
   * 待機中のリクエスト数
   */
  pendingRequests: number;
}

/**
 * データベース分離レベル
 */
export type IsolationLevel =
  | "READ_UNCOMMITTED"
  | "READ_COMMITTED"
  | "REPEATABLE_READ"
  | "SERIALIZABLE";

/**
 * トランザクションオプション
 */
export interface TransactionOptions {
  /**
   * 分離レベル
   */
  isolationLevel?: IsolationLevel;

  /**
   * 読み取り専用フラグ
   */
  readOnly?: boolean;

  /**
   * タイムアウト（ミリ秒）
   */
  timeout?: number;
}

/**
 * トランザクション状態
 */
export type TransactionStatus =
  | "PENDING" // 開始待ち
  | "ACTIVE" // 実行中
  | "COMMITTED" // コミット済み
  | "ROLLED_BACK" // ロールバック済み
  | "ERROR"; // エラー状態
