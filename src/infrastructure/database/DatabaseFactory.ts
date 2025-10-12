/**
 * データベースファクトリーの実装
 * クリーンアーキテクチャに基づく抽象ファクトリーパターン
 */

import type {
  IDatabaseFactory,
  DatabaseType,
} from "./interfaces/IDatabaseFactory";
import type { IDatabaseConnection } from "./interfaces/IDatabaseConnection";
import type { IConnectionPool } from "./interfaces/IConnectionPool";
import type { ConnectionConfig } from "@/libs/database/interfaces/core";
import { MySQLConnection } from "./mysql/connection/MySQLConnection";
import { MySQLConnectionPool } from "./mysql/connection/MySQLConnectionPool";
import { ConfigurationError } from "./errors";

/**
 * サポートされているデータベース種別の定数
 */
export const SUPPORTED_DATABASE_TYPES = ["mysql"] as const;

/**
 * データベースファクトリーの具象実装
 */
export class DatabaseFactory implements IDatabaseFactory {
  private readonly supportedTypes: readonly DatabaseType[] =
    SUPPORTED_DATABASE_TYPES;

  /**
   * データベース接続を作成する
   */
  createConnection(
    type: DatabaseType,
    config: ConnectionConfig
  ): IDatabaseConnection {
    this.validateType(type);
    this.validateConfig(config);

    switch (type) {
      case "mysql":
        return new MySQLConnection(config);

      case "postgresql":
        throw new ConfigurationError("PostgreSQL support not implemented yet", {
          type,
          config: this.sanitizeConfig(config),
        });

      case "sqlite":
        throw new ConfigurationError("SQLite support not implemented yet", {
          type,
          config: this.sanitizeConfig(config),
        });

      case "memory":
        throw new ConfigurationError(
          "In-memory database support not implemented yet",
          { type, config: this.sanitizeConfig(config) }
        );

      default:
        throw new ConfigurationError(`Unsupported database type: ${type}`, {
          type,
          supportedTypes: this.supportedTypes,
        });
    }
  }

  /**
   * コネクションプールを作成する
   */
  createConnectionPool(
    type: DatabaseType,
    config: ConnectionConfig
  ): IConnectionPool {
    this.validateType(type);
    this.validateConfig(config);

    switch (type) {
      case "mysql":
        return new MySQLConnectionPool();

      case "postgresql":
      case "sqlite":
      case "memory":
        throw new ConfigurationError(
          `Connection pool not implemented for database type: ${type}`,
          { type, config: this.sanitizeConfig(config) }
        );

      default:
        throw new ConfigurationError(`Unsupported database type: ${type}`, {
          type,
          supportedTypes: this.supportedTypes,
        });
    }
  }

  /**
   * サポートされているデータベース種別を取得する
   */
  getSupportedTypes(): DatabaseType[] {
    return [...this.supportedTypes];
  }

  /**
   * 指定された種別がサポートされているかチェックする
   */
  isTypeSupported(type: DatabaseType): boolean {
    return this.supportedTypes.includes(type);
  }

  /**
   * データベース種別の妥当性をチェックする
   */
  private validateType(type: DatabaseType): void {
    if (!this.isTypeSupported(type)) {
      throw new ConfigurationError(`Unsupported database type: ${type}`, {
        type,
        supportedTypes: this.supportedTypes,
      });
    }
  }

  /**
   * 接続設定の妥当性をチェックする
   */
  private validateConfig(config: ConnectionConfig): void {
    const errors: string[] = [];

    if (!config.host) {
      errors.push("Host is required");
    }

    if (!config.port || config.port <= 0 || config.port > 65535) {
      errors.push("Valid port number is required");
    }

    if (!config.database) {
      errors.push("Database name is required");
    }

    if (!config.username) {
      errors.push("User is required");
    }

    // NOTE: pool設定は現行のConnectionConfigから除去されたため一時的に無効化
    // 将来的に再導入する場合はConnectionConfigにpool型を戻し、ここでバリデーションを再度有効化する
    // if (config.pool) { ... }

    if (errors.length > 0) {
      throw new ConfigurationError(
        `Invalid database configuration: ${errors.join(", ")}`,
        { config: this.sanitizeConfig(config), errors }
      );
    }
  }

  /**
   * 設定からパスワードを除去してログ出力用に安全にする
   */
  private sanitizeConfig(config: ConnectionConfig): Partial<ConnectionConfig> {
    return {
      ...config,
      password: config.password ? "[REDACTED]" : undefined,
    };
  }
}

/**
 * デフォルトファクトリーインスタンス
 */
export const databaseFactory = new DatabaseFactory();
