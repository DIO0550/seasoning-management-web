/**
 * データベースファクトリーの抽象化
 * 複数のデータベース実装をサポートする真のファクトリーパターン
 */

import type { IDatabaseConnection } from "../interfaces/i-database-connection";
import type { IConnectionPool } from "../interfaces/i-connection-pool";
import type { ConnectionConfig } from "@/libs/database/interfaces/core";

/**
 * サポートするデータベース種別
 */
export type DatabaseType = "mysql" | "postgresql" | "sqlite" | "memory";

/**
 * データベースファクトリーのインターフェース
 */
export interface IDatabaseFactory {
  /**
   * データベース接続を作成する
   * @param type データベース種別
   * @param config 接続設定
   * @returns データベース接続インスタンス
   */
  createConnection(
    type: DatabaseType,
    config: ConnectionConfig
  ): IDatabaseConnection;

  /**
   * コネクションプールを作成する
   * @param type データベース種別
   * @param config 接続設定
   * @returns コネクションプールインスタンス
   */
  createConnectionPool(
    type: DatabaseType,
    config: ConnectionConfig
  ): IConnectionPool;

  /**
   * サポートされているデータベース種別を取得する
   * @returns サポートされている種別の配列
   */
  getSupportedTypes(): DatabaseType[];

  /**
   * 指定された種別がサポートされているかチェックする
   * @param type チェックする種別
   * @returns サポートされている場合はtrue
   */
  isTypeSupported(type: DatabaseType): boolean;
}
