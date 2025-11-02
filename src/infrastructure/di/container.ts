/**
 * 依存注入コンテナの実装（infrastructure 配下に移設）
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

export class DIContainer implements IDIContainer {
  private readonly registrations = new Map<
    ServiceIdentifier,
    ServiceRegistration
  >();
  private readonly singletonInstances = new Map<ServiceIdentifier, unknown>();
  private readonly resolutionStack: ServiceIdentifier[] = [];

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

  resolve<T>(identifier: ServiceIdentifier<T>): T {
    if (this.resolutionStack.includes(identifier)) {
      const cyclePath = [...this.resolutionStack, identifier];
      throw new CircularDependencyError(cyclePath);
    }

    const registration = this.registrations.get(identifier);
    if (!registration) {
      throw new ServiceNotFoundError(identifier);
    }

    if (registration.lifetime === Lifetime.SINGLETON) {
      const existingInstance = this.singletonInstances.get(identifier);
      if (existingInstance) {
        return existingInstance as T;
      }
    }

    this.resolutionStack.push(identifier);

    try {
      const instance = registration.factory() as T;

      if (registration.lifetime === Lifetime.SINGLETON) {
        this.singletonInstances.set(identifier, instance);
      }

      return instance;
    } finally {
      this.resolutionStack.pop();
    }
  }

  isRegistered<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.registrations.has(identifier);
  }

  clear(): void {
    this.registrations.clear();
    this.singletonInstances.clear();
    this.resolutionStack.length = 0;
  }
}
