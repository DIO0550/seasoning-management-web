import type {
  IDatabaseConnection,
  QueryResult,
  ConnectionConfig,
  PoolStats,
} from "@/libs/database/interfaces";
import { ITransaction } from "@/libs/database/interfaces/ITransaction";
import type { IConnectionAdapter } from "@/libs/database/interfaces/IConnectionAdapter";
import { createMySQLError } from "../errors";
import { MySQLTransaction } from "./MySQLTransaction";

/**
 * MySQL用のデータベース接続実装
 * IConnectionAdapterをラップして統一されたインターフェースを提供
 */
export class MySQLConnection implements IDatabaseConnection {
  private _isConnected: boolean = false;

  constructor(private readonly _adapter: IConnectionAdapter) {}

  /**
   * データベースに接続する
   */
  async connect(): Promise<void> {
    if (this._isConnected) {
      return; // 既に接続済み
    }

    try {
      await this._adapter.ping(); // 接続テスト
      this._isConnected = true;
    } catch (error) {
      this._isConnected = false;
      throw createMySQLError(error, "CONNECTION_ERROR");
    }
  }

  /**
   * データベース接続を切断する
   */
  async disconnect(): Promise<void> {
    if (!this._isConnected) {
      return; // 既に切断済み
    }

    try {
      await this._adapter.end();
      this._isConnected = false;
    } catch (error) {
      throw createMySQLError(error, "CONNECTION_ERROR");
    }
  }

  /**
   * SQLクエリを実行し、結果を返す
   */
  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    if (!this._isConnected) {
      throw createMySQLError(
        new Error("Not connected to database"),
        "CONNECTION_ERROR"
      );
    }

    try {
      return await this._adapter.query<T>(sql, params);
    } catch (error) {
      throw createMySQLError(error, "QUERY_ERROR");
    }
  }

  /**
   * トランザクションを開始する
   */
  async beginTransaction(): Promise<ITransaction> {
    if (!this._isConnected) {
      throw createMySQLError(
        new Error("Not connected to database"),
        "CONNECTION_ERROR"
      );
    }

    try {
      // アダプターからトランザクションアダプターを取得
      const transactionAdapter = await this._adapter.beginTransaction();
      // MySQLTransactionインスタンスを作成して返す
      return new MySQLTransaction(transactionAdapter);
    } catch (error) {
      throw createMySQLError(error, "TRANSACTION_ERROR");
    }
  }

  /**
   * データベース接続の状態を取得する
   */
  isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * 接続設定を取得する
   */
  getConfig(): ConnectionConfig {
    return this._adapter.getConfig();
  }

  /**
   * データベース接続の統計情報を取得する
   */
  getStats(): PoolStats {
    return this._adapter.getStats();
  }

  /**
   * データベース接続をテストする
   */
  async ping(): Promise<boolean> {
    try {
      await this._adapter.ping();
      return true;
    } catch {
      return false;
    }
  }
}
