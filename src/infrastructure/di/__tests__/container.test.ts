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

    test("同じ識別子で複数回登録すると後者で上書きされる", () => {
      // Arrange
      const service1 = { value: "first" };
      const service2 = { value: "second" };
      const factory1 = () => service1;
      const factory2 = () => service2;

      // Act
      container.register("test-service", factory1);
      container.register("test-service", factory2);
      const resolved = container.resolve("test-service");

      // Assert
      expect(resolved).toBe(service2);
    });

    test("Symbolベースの識別子で登録できる", () => {
      // Arrange
      const symbol = Symbol("test-service");
      const service = { value: "test" };
      const factory = () => service;

      // Act
      container.register(symbol, factory);
      const resolved = container.resolve(symbol);

      // Assert
      expect(resolved).toBe(service);
    });

    test("関数型の識別子で登録できる", () => {
      // Arrange
      class TestService {
        value = "test";
      }
      const factory = () => new TestService();

      // Act
      container.register(TestService, factory);
      const resolved = container.resolve(TestService);

      // Assert
      expect(resolved).toBeInstanceOf(TestService);
      expect(resolved.value).toBe("test");
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

    test("ServiceNotFoundErrorに適切なメッセージが含まれる", () => {
      // Act & Assert
      expect(() => {
        container.resolve("missing-service");
      }).toThrow("Service not found: missing-service");
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

    test("3段階の循環依存も検出できる", () => {
      // Arrange
      container.register("service-a", () => container.resolve("service-b"));
      container.register("service-b", () => container.resolve("service-c"));
      container.register("service-c", () => container.resolve("service-a"));

      // Act & Assert
      expect(() => {
        container.resolve("service-a");
      }).toThrow(CircularDependencyError);
    });

    test("CircularDependencyErrorに適切なメッセージが含まれる", () => {
      // Arrange
      container.register("service-a", () => container.resolve("service-b"));
      container.register("service-b", () => container.resolve("service-a"));

      // Act & Assert
      expect(() => {
        container.resolve("service-a");
      }).toThrow("Circular dependency detected");
    });

    test("正常な依存関係は循環依存として誤検出されない", () => {
      // Arrange
      const serviceC = { value: "c" };
      container.register("service-c", () => serviceC);
      container.register("service-b", () => ({
        c: container.resolve("service-c"),
        value: "b",
      }));
      container.register("service-a", () => ({
        b: container.resolve("service-b"),
        value: "a",
      }));

      // Act & Assert
      expect(() => {
        container.resolve("service-a");
      }).not.toThrow();

      const resolved = container.resolve<{
        value: string;
        b: { value: string; c: { value: string } };
      }>("service-a");
      expect(resolved.value).toBe("a");
      expect(resolved.b.value).toBe("b");
      expect(resolved.b.c.value).toBe("c");
    });

    test("ファクトリー関数でエラーが発生した場合は元のエラーが伝播される", () => {
      // Arrange
      const errorMessage = "Factory error";
      container.register("error-service", () => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => {
        container.resolve("error-service");
      }).toThrow(errorMessage);
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

    test("クリア後は登録されていたサービスもfalseを返す", () => {
      // Arrange
      const factory = () => ({ value: "test" });
      container.register("service", factory);

      // Act
      container.clear();

      // Assert
      expect(container.isRegistered("service")).toBe(false);
    });

    test("Symbolベースの識別子の確認もできる", () => {
      // Arrange
      const symbol = Symbol("test-service");
      const factory = () => ({ value: "test" });
      container.register(symbol, factory);

      // Act & Assert
      expect(container.isRegistered(symbol)).toBe(true);
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

    test("clearでシングルトンインスタンスも削除される", () => {
      // Arrange
      const factory = () => ({ value: Math.random() });
      container.register("singleton", factory, ServiceLifetime.SINGLETON);

      const instance1 = container.resolve<{ value: number }>("singleton");
      container.clear();

      // 再登録
      container.register("singleton", factory, ServiceLifetime.SINGLETON);
      const instance2 = container.resolve<{ value: number }>("singleton");

      // Assert
      expect(instance1).not.toBe(instance2);
      expect(instance1.value).not.toBe(instance2.value);
    });

    test("空のコンテナでclearを呼んでもエラーにならない", () => {
      // Act & Assert
      expect(() => {
        container.clear();
      }).not.toThrow();
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

    test("クラスコンストラクタベースの登録・解決", () => {
      // Arrange
      class UserService {
        getUser() {
          return { id: 1, name: "Test User" };
        }
      }

      // Act
      container.register(UserService, () => new UserService());
      const resolved = container.resolve(UserService);

      // Assert
      expect(resolved).toBeInstanceOf(UserService);
      expect(resolved.getUser()).toEqual({ id: 1, name: "Test User" });
    });
  });

  describe("エッジケース", () => {
    test("nullを返すファクトリーも正常に動作する", () => {
      // Arrange
      container.register("null-service", () => null);

      // Act
      const resolved = container.resolve("null-service");

      // Assert
      expect(resolved).toBeNull();
    });

    test("undefinedを返すファクトリーも正常に動作する", () => {
      // Arrange
      container.register("undefined-service", () => undefined);

      // Act
      const resolved = container.resolve("undefined-service");

      // Assert
      expect(resolved).toBeUndefined();
    });

    test("プリミティブ値を返すファクトリーも正常に動作する", () => {
      // Arrange
      container.register("string-service", () => "test-string");
      container.register("number-service", () => 42);
      container.register("boolean-service", () => true);

      // Act & Assert
      expect(container.resolve("string-service")).toBe("test-string");
      expect(container.resolve("number-service")).toBe(42);
      expect(container.resolve("boolean-service")).toBe(true);
    });

    test("コンテナ自身への参照を含む依存関係も処理できる", () => {
      // Arrange
      interface ServiceWithContainer {
        container: DIContainer;
        getValue(): string;
      }

      container.register<ServiceWithContainer>("container-service", () => ({
        container,
        getValue: () => "has-container",
      }));

      // Act
      const resolved =
        container.resolve<ServiceWithContainer>("container-service");

      // Assert
      expect(resolved.container).toBe(container);
      expect(resolved.getValue()).toBe("has-container");
    });
  });

  describe("パフォーマンステスト", () => {
    test("大量のサービス登録・解決が適切な時間で実行される", () => {
      // Arrange
      const serviceCount = 1000;
      const startTime = performance.now();

      // Act
      for (let i = 0; i < serviceCount; i++) {
        container.register(`service-${i}`, () => ({ id: i }));
      }

      for (let i = 0; i < serviceCount; i++) {
        container.resolve(`service-${i}`);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Assert (1000サービスで1秒以内を期待)
      expect(duration).toBeLessThan(1000);
    });

    test("シングルトンインスタンスのキャッシュが効率的に動作する", () => {
      // Arrange
      let factoryCallCount = 0;
      container.register(
        "cached-service",
        () => {
          factoryCallCount++;
          return { value: factoryCallCount };
        },
        ServiceLifetime.SINGLETON
      );

      // Act
      for (let i = 0; i < 100; i++) {
        container.resolve("cached-service");
      }

      // Assert
      expect(factoryCallCount).toBe(1);
    });
  });
});
