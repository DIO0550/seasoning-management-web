/**
 * サービスバインディング設定
 * @description インターフェースと実装のマッピング定義
 */

import type { DIContainer } from "./container";
import type { ServiceIdentifier } from "./types";

// リポジトリインターフェースのインポート
import type { ISeasoningRepository } from "@/libs/database/interfaces";
import type { ISeasoningTypeRepository } from "@/libs/database/interfaces";
import type { ISeasoningImageRepository } from "@/libs/database/interfaces";
import type { ISeasoningTemplateRepository } from "@/libs/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces";

// MySQL実装のインポート
import { MySQLSeasoningRepository } from "@/libs/database/mysql/repositories/MySQLSeasoningRepository";
import { MySQLSeasoningTypeRepository } from "@/libs/database/mysql/repositories/MySQLSeasoningTypeRepository";
import { MySQLSeasoningImageRepository } from "@/libs/database/mysql/repositories/MySQLSeasoningImageRepository";
import { MySQLSeasoningTemplateRepository } from "@/libs/database/mysql/repositories/MySQLSeasoningTemplateRepository";

// 接続ファクトリーのインポート
import {
  createDevelopmentConnection,
  createProductionConnection,
  createTestConnection,
} from "./factories";

/**
 * サービス識別子の定義
 */
export const SERVICE_IDENTIFIERS = {
  // データベース接続
  DATABASE_CONNECTION: Symbol(
    "DatabaseConnection"
  ) as ServiceIdentifier<IDatabaseConnection>,

  // リポジトリ
  SEASONING_REPOSITORY: Symbol(
    "SeasoningRepository"
  ) as ServiceIdentifier<ISeasoningRepository>,
  SEASONING_TYPE_REPOSITORY: Symbol(
    "SeasoningTypeRepository"
  ) as ServiceIdentifier<ISeasoningTypeRepository>,
  SEASONING_IMAGE_REPOSITORY: Symbol(
    "SeasoningImageRepository"
  ) as ServiceIdentifier<ISeasoningImageRepository>,
  SEASONING_TEMPLATE_REPOSITORY: Symbol(
    "SeasoningTemplateRepository"
  ) as ServiceIdentifier<ISeasoningTemplateRepository>,
} as const;

/**
 * 開発環境用のバインディング設定
 * @param container DIコンテナ
 */
export const configureForDevelopment = (container: DIContainer): void => {
  // データベース接続の設定（非同期ファクトリー）
  container.register(SERVICE_IDENTIFIERS.DATABASE_CONNECTION, () => {
    // 同期的な呼び出しのため、プレースホルダーを返し、実際の接続は遅延初期化
    const connectionPromise = createDevelopmentConnection();
    return connectionPromise as unknown as IDatabaseConnection;
  });

  // リポジトリの設定
  container.register(
    SERVICE_IDENTIFIERS.SEASONING_REPOSITORY,
    () =>
      new MySQLSeasoningRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_TYPE_REPOSITORY,
    () =>
      new MySQLSeasoningTypeRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_IMAGE_REPOSITORY,
    () =>
      new MySQLSeasoningImageRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_TEMPLATE_REPOSITORY,
    () =>
      new MySQLSeasoningTemplateRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );
};

/**
 * 本番環境用のバインディング設定
 * @param container DIコンテナ
 */
export const configureForProduction = (container: DIContainer): void => {
  // データベース接続の設定
  container.register(SERVICE_IDENTIFIERS.DATABASE_CONNECTION, () => {
    const connectionPromise = createProductionConnection();
    return connectionPromise as unknown as IDatabaseConnection;
  });

  // リポジトリの設定（開発環境と同様）
  container.register(
    SERVICE_IDENTIFIERS.SEASONING_REPOSITORY,
    () =>
      new MySQLSeasoningRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_TYPE_REPOSITORY,
    () =>
      new MySQLSeasoningTypeRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_IMAGE_REPOSITORY,
    () =>
      new MySQLSeasoningImageRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_TEMPLATE_REPOSITORY,
    () =>
      new MySQLSeasoningTemplateRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );
};

/**
 * テスト環境用のバインディング設定
 * @param container DIコンテナ
 */
export const configureForTest = (container: DIContainer): void => {
  // データベース接続の設定
  container.register(SERVICE_IDENTIFIERS.DATABASE_CONNECTION, () => {
    const connectionPromise = createTestConnection();
    return connectionPromise as unknown as IDatabaseConnection;
  });

  // リポジトリの設定（開発環境と同様）
  container.register(
    SERVICE_IDENTIFIERS.SEASONING_REPOSITORY,
    () =>
      new MySQLSeasoningRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_TYPE_REPOSITORY,
    () =>
      new MySQLSeasoningTypeRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_IMAGE_REPOSITORY,
    () =>
      new MySQLSeasoningImageRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );

  container.register(
    SERVICE_IDENTIFIERS.SEASONING_TEMPLATE_REPOSITORY,
    () =>
      new MySQLSeasoningTemplateRepository(
        container.resolve(SERVICE_IDENTIFIERS.DATABASE_CONNECTION)
      )
  );
};
