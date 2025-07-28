/**
 * 依存注入コンテナの型定義
 * @description クリーンアーキテクチャに基づく依存注入システムの型定義
 */

/**
 * サービスの識別子として使用するシンボル型
 */
export type ServiceIdentifier<T = unknown> =
  | symbol
  | string
  | (new (...args: unknown[]) => T);

/**
 * サービスファクトリ関数の型
 */
export type ServiceFactory<T> = () => T;

/**
 * サービスの生存期間を定義する列挙型
 */
export const ServiceLifetime = {
  /** 毎回新しいインスタンスを作成 */
  TRANSIENT: "transient",
  /** シングルトンインスタンス */
  SINGLETON: "singleton",
} as const;

export type ServiceLifetime =
  (typeof ServiceLifetime)[keyof typeof ServiceLifetime];

/**
 * サービス登録情報の型
 */
export interface ServiceRegistration<T = unknown> {
  /** サービスの識別子 */
  identifier: ServiceIdentifier<T>;
  /** サービスファクトリ関数 */
  factory: ServiceFactory<T>;
  /** 生存期間 */
  lifetime: ServiceLifetime;
}

/**
 * DIコンテナのメインインターフェース
 */
export interface IDIContainer {
  /**
   * サービスを登録する
   * @param identifier サービス識別子
   * @param factory ファクトリ関数
   * @param lifetime 生存期間（デフォルト: SINGLETON）
   */
  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    lifetime?: ServiceLifetime
  ): void;

  /**
   * サービスを解決する
   * @param identifier サービス識別子
   * @returns サービスインスタンス
   * @throws {ServiceNotFoundError} サービスが見つからない場合
   * @throws {CircularDependencyError} 循環依存が検出された場合
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T;

  /**
   * サービスが登録されているかチェックする
   * @param identifier サービス識別子
   * @returns 登録されている場合true
   */
  isRegistered<T>(identifier: ServiceIdentifier<T>): boolean;

  /**
   * すべての登録を削除する
   */
  clear(): void;
}

/**
 * サービスが見つからない場合のエラー
 */
export class ServiceNotFoundError extends Error {
  constructor(identifier: ServiceIdentifier) {
    const name =
      typeof identifier === "symbol"
        ? identifier.toString()
        : typeof identifier === "string"
        ? identifier
        : identifier.name;

    super(`Service not found: ${name}`);
    this.name = "ServiceNotFoundError";
  }
}

/**
 * 循環依存が検出された場合のエラー
 */
export class CircularDependencyError extends Error {
  constructor(path: ServiceIdentifier[]) {
    const pathStr = path
      .map((id) =>
        typeof id === "symbol"
          ? id.toString()
          : typeof id === "string"
          ? id
          : id.name
      )
      .join(" -> ");

    super(`Circular dependency detected: ${pathStr}`);
    this.name = "CircularDependencyError";
  }
}
