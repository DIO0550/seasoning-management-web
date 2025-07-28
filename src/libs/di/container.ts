/**
 * 依存注入コンテナの実装
 * @description クリーンアーキテクチャに基づく依存注入システム
 */

import {
  type IDIContainer,
  type ServiceIdentifier,
  type ServiceFactory,
  type ServiceLifetime,
  type ServiceRegistration,
  ServiceLifetime as Lifetime,
  ServiceNotFoundError,
  CircularDependencyError,
} from "./types";

/**
 * DIコンテナの実装クラス
 */
export class DIContainer implements IDIContainer {
  private readonly registrations = new Map<
    ServiceIdentifier,
    ServiceRegistration
  >();
  private readonly singletonInstances = new Map<ServiceIdentifier, unknown>();
  private readonly resolutionStack: ServiceIdentifier[] = [];

  /**
   * サービスを登録する
   * @param identifier サービス識別子
   * @param factory ファクトリ関数
   * @param lifetime 生存期間（デフォルト: SINGLETON）
   */
  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    lifetime: ServiceLifetime = Lifetime.SINGLETON
  ): void {
    const registration: ServiceRegistration<T> = {
      identifier,
      factory,
      lifetime,
    };

    this.registrations.set(identifier, registration);
  }

  /**
   * サービスを解決する
   * @param identifier サービス識別子
   * @returns サービスインスタンス
   * @throws {ServiceNotFoundError} サービスが見つからない場合
   * @throws {CircularDependencyError} 循環依存が検出された場合
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T {
    // 循環依存チェック
    if (this.resolutionStack.includes(identifier)) {
      const cyclePath = [...this.resolutionStack, identifier];
      throw new CircularDependencyError(cyclePath);
    }

    // サービス登録チェック
    const registration = this.registrations.get(identifier);
    if (!registration) {
      throw new ServiceNotFoundError(identifier);
    }

    // シングルトンインスタンス存在チェック
    if (registration.lifetime === Lifetime.SINGLETON) {
      const existingInstance = this.singletonInstances.get(identifier);
      if (existingInstance) {
        return existingInstance as T;
      }
    }

    // 解決スタックに追加
    this.resolutionStack.push(identifier);

    try {
      // インスタンス作成
      const instance = registration.factory() as T;

      // シングルトンの場合はキャッシュ
      if (registration.lifetime === Lifetime.SINGLETON) {
        this.singletonInstances.set(identifier, instance);
      }

      return instance;
    } finally {
      // 解決スタックから削除
      this.resolutionStack.pop();
    }
  }

  /**
   * サービスが登録されているかチェックする
   * @param identifier サービス識別子
   * @returns 登録されている場合true
   */
  isRegistered<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.registrations.has(identifier);
  }

  /**
   * すべての登録を削除する
   */
  clear(): void {
    this.registrations.clear();
    this.singletonInstances.clear();
    this.resolutionStack.length = 0;
  }
}
