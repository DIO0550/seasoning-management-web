import type { SslOptions } from "mysql2/promise";
import type {
  QueryResult,
  ConnectionConfig,
} from "@/libs/database/interfaces/IDatabaseConnection";
import type {
  MySQLQueryResult,
  MySQLConnectionConfig,
} from "@/libs/database/mysql/types";

/**
 * MySQL型変換のコンパニオンオブジェクト
 */

/**
 * MySQLQueryResultのコンパニオンオブジェクト
 */
export const MySQLQueryResultConverter = {
  /**
   * mysql2の結果を独自のQueryResultに変換
   */
  toQueryResult<T>(mysqlResult: MySQLQueryResult<T>): QueryResult<T> {
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
 * MySQLConnectionConfigのコンパニオンオブジェクト
 */
export const MySQLConnectionConfigConverter = {
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
