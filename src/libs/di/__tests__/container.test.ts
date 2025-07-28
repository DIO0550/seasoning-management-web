/**
 * DIコンテナのユニットテスト
 * @description TDD Red Phase - 失敗するテストから開始
 */

import { describe, test, expect, beforeEach } from "vitest";
import { DIContainer } from "../container";
import {
  ServiceNotFoundError,
  CircularDependencyError,
  ServiceLifetime,
} from "../types";

describe("DIContainer", () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  describe("サービス登録", () => {
    test("サービスを登録できる", () => {
      // Arrange
      const testService = { value: "test" };
      const factory = () => testService;

      // Act & Assert
      expect(() => {
        container.register("test-service", factory);
      }).not.toThrow();
    });

    test("シングルトンライフタイムで登録できる", () => {
      // Arrange
      const testService = { value: "test" };
      const factory = () => testService;

      // Act & Assert
      expect(() => {
        container.register("test-service", factory, ServiceLifetime.SINGLETON);
      }).not.toThrow();
    });

    test("トランジェントライフタイムで登録できる", () => {
      // Arrange
      const testService = { value: "test" };
      const factory = () => testService;

      // Act & Assert
      expect(() => {
        container.register("test-service", factory, ServiceLifetime.TRANSIENT);
      }).not.toThrow();
    });
  });

  describe("サービス解決", () => {
    test("登録されたサービスを解決できる", () => {
      // Arrange
      const testService = { value: "test" };
      const factory = () => testService;
      container.register("test-service", factory);

      // Act
      const resolved = container.resolve("test-service");

      // Assert
      expect(resolved).toBe(testService);
    });

    test("シングルトンサービスは同じインスタンスを返す", () => {
      // Arrange
      const factory = () => ({ value: Math.random() });
      container.register(
        "singleton-service",
        factory,
        ServiceLifetime.SINGLETON
      );

      // Act
      const instance1 = container.resolve<{ value: number }>(
        "singleton-service"
      );
      const instance2 = container.resolve<{ value: number }>(
        "singleton-service"
      );

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance1.value).toBe(instance2.value);
    });

    test("トランジェントサービスは新しいインスタンスを返す", () => {
      // Arrange
      const factory = () => ({ value: Math.random() });
      container.register(
        "transient-service",
        factory,
        ServiceLifetime.TRANSIENT
      );

      // Act
      const instance1 = container.resolve<{ value: number }>(
        "transient-service"
      );
      const instance2 = container.resolve<{ value: number }>(
        "transient-service"
      );

      // Assert
      expect(instance1).not.toBe(instance2);
      expect(instance1.value).not.toBe(instance2.value);
    });

    test("未登録のサービス解決時にServiceNotFoundErrorをスローする", () => {
      // Act & Assert
      expect(() => {
        container.resolve("non-existent-service");
      }).toThrow(ServiceNotFoundError);
    });

    test("循環依存を検出してCircularDependencyErrorをスローする", () => {
      // Arrange
      container.register("service-a", () => container.resolve("service-b"));
      container.register("service-b", () => container.resolve("service-a"));

      // Act & Assert
      expect(() => {
        container.resolve("service-a");
      }).toThrow(CircularDependencyError);
    });
  });

  describe("サービス確認", () => {
    test("登録されたサービスに対してtrueを返す", () => {
      // Arrange
      const factory = () => ({ value: "test" });
      container.register("registered-service", factory);

      // Act & Assert
      expect(container.isRegistered("registered-service")).toBe(true);
    });

    test("未登録のサービスに対してfalseを返す", () => {
      // Act & Assert
      expect(container.isRegistered("unregistered-service")).toBe(false);
    });
  });

  describe("コンテナ管理", () => {
    test("clearで全ての登録を削除できる", () => {
      // Arrange
      const factory = () => ({ value: "test" });
      container.register("service1", factory);
      container.register("service2", factory);

      // Act
      container.clear();

      // Assert
      expect(container.isRegistered("service1")).toBe(false);
      expect(container.isRegistered("service2")).toBe(false);
    });
  });

  describe("型安全性", () => {
    test("型付きサービス識別子で登録・解決できる", () => {
      // Arrange
      interface TestService {
        getValue(): string;
      }

      const testService: TestService = {
        getValue: () => "test-value",
      };

      const SERVICE_SYMBOL = Symbol("TestService");
      const factory = (): TestService => testService;

      // Act
      container.register<TestService>(SERVICE_SYMBOL, factory);
      const resolved = container.resolve<TestService>(SERVICE_SYMBOL);

      // Assert
      expect(resolved.getValue()).toBe("test-value");
    });
  });
});
