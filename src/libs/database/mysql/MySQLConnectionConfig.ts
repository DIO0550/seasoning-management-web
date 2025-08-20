import type { SslOptions } from "mysql2/promise";
import type { ConnectionConfig } from "@/libs/database/interfaces";

/**
 * MySQL接続設定に関する型定義
 */

/**
 * mysql2の接続設定型
 */
export interface MySQLConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  acquireTimeout?: number;
  timeout?: number;
  connectionLimit?: number;
  ssl?: string | SslOptions;
}

/**
 * MySQLConnectionConfigのコンパニオンオブジェクト
 */
export const MySQLConnectionConfig = {
  /**
   * 独自のConnectionConfigからMySQL設定に変換
   */
  from(config: ConnectionConfig): MySQLConnectionConfig {
    const mysqlConfig: MySQLConnectionConfig = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
    };

    if (config.connectTimeout) {
      mysqlConfig.acquireTimeout = config.connectTimeout;
    }

    if (config.queryTimeout) {
      mysqlConfig.timeout = config.queryTimeout;
    }

    if (config.maxConnections) {
      mysqlConfig.connectionLimit = config.maxConnections;
    }

    if (config.ssl) {
      if (typeof config.ssl === "boolean") {
        // booleanの場合は文字列として扱う（mysql2の仕様に合わせる）
        mysqlConfig.ssl = config.ssl ? "Amazon RDS" : undefined;
      } else {
        // オブジェクトの場合はSslOptionsとして扱う
        mysqlConfig.ssl = config.ssl as SslOptions;
      }
    }

    if (config.options) {
      Object.assign(mysqlConfig, config.options);
    }

    return mysqlConfig;
  },
} as const;
