import type { ITransaction } from "./ITransaction";
import type {
  QueryResult,
  ConnectionConfig,
  TransactionOptions,
} from "../shared";

/**
 * データベース接続のインターフェース
 * インフラストラクチャ層の抽象化
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
   * @returns トランザクションインスタンス
   * @throws {TransactionError} トランザクション開始に失敗した場合
   */
  beginTransaction(options?: TransactionOptions): Promise<ITransaction>;

  /**
   * 接続の健全性をチェックする
   * @returns 接続が健全な場合はtrue
   */
  ping(): Promise<boolean>;

  /**
   * 接続設定を取得する
   * @returns 接続設定情報
   */
  getConfig(): ConnectionConfig;
}
