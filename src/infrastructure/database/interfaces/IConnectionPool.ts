import type { IDatabaseConnection } from "./IDatabaseConnection";
import type { PoolConfig, ConnectionConfig } from "../shared";

/**
 * データベースコネクションプールのインターフェース
 * インフラストラクチャ層の抽象化
 */
export interface IConnectionPool {
  /**
   * プールを初期化する
   * @param config 接続設定
   * @throws {PoolError} 初期化に失敗した場合
   */
  initialize(config: ConnectionConfig): Promise<void>;

  /**
   * プールから接続を取得する
   * @returns データベース接続
   * @throws {PoolError} 接続取得に失敗した場合
   */
  acquire(): Promise<IDatabaseConnection>;

  /**
   * 接続をプールに返却する
   * @param connection 返却する接続
   * @throws {PoolError} 返却に失敗した場合
   */
  release(connection: IDatabaseConnection): Promise<void>;

  /**
   * プールを破棄する
   * @throws {PoolError} 破棄に失敗した場合
   */
  destroy(): Promise<void>;

  /**
   * プールの統計情報を取得する
   * @returns プール統計情報
   */
  getStats(): PoolStats;

  /**
   * プールの健全性をチェックする
   * @returns プールが健全な場合はtrue
   */
  isHealthy(): boolean;

  /**
   * プール設定を取得する
   * @returns プール設定
   */
  getConfig(): PoolConfig;
}

/**
 * プール統計情報
 */
export interface PoolStats {
  /** 総接続数 */
  totalConnections: number;
  /** アクティブ接続数 */
  activeConnections: number;
  /** アイドル接続数 */
  idleConnections: number;
  /** 待機中のリクエスト数 */
  pendingRequests: number;
  /** 取得済み接続数 */
  acquiredConnections: number;
  /** プール作成時刻 */
  createdAt: Date;
  /** 最後のアクティビティ時刻 */
  lastActivity: Date;
  /** エラー統計 */
  errors: {
    connectionErrors: number;
    timeoutErrors: number;
    otherErrors: number;
  };
}

/**
 * プールイベントハンドラー
 */
export interface PoolEventHandlers {
  onConnect?: (connection: IDatabaseConnection) => void;
  onDisconnect?: (connection: IDatabaseConnection) => void;
  onError?: (error: Error) => void;
  onAcquire?: (connection: IDatabaseConnection) => void;
  onRelease?: (connection: IDatabaseConnection) => void;
}
