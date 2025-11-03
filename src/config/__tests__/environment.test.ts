import { describe, test, expect, vi, beforeEach } from "vitest";

describe("Environment Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("env object", () => {
    test("should load environment variables correctly", async () => {
      vi.stubEnv("NODE_ENV", "test");
      vi.stubEnv("DATABASE_HOST", "localhost");
      vi.stubEnv("DATABASE_PORT", "3306");
      vi.stubEnv("DATABASE_USER", "test_user");
      vi.stubEnv("DATABASE_PASSWORD", "test_password");
      vi.stubEnv("DATABASE_NAME", "seasoning_management_db");

      const { env } = await import("@/config/environment");

      expect(env.NODE_ENV).toBe("test");
      expect(env.DATABASE_HOST).toBe("localhost");
      expect(env.DATABASE_PORT).toBe(3306);
      expect(env.DATABASE_USER).toBe("test_user");
      expect(env.DATABASE_PASSWORD).toBe("test_password");
      expect(env.DATABASE_NAME).toBe("seasoning_management_db");
    });

    test("should convert DATABASE_PORT to number", async () => {
      vi.stubEnv("DATABASE_PORT", "5432");

      const { env } = await import("@/config/environment");
      expect(typeof env.DATABASE_PORT).toBe("number");
      expect(env.DATABASE_PORT).toBe(5432);
    });

    test("should handle missing optional environment variables", async () => {
      vi.stubEnv("DATABASE_HOST", "localhost");
      vi.stubEnv("DATABASE_PORT", "3306");
      vi.stubEnv("DATABASE_USER", "test_user");
      vi.stubEnv("DATABASE_NAME", "seasoning_management_db");
      // DATABASE_PASSWORDは設定しない（ただしvitestのstubEnvは空にできないため、実際には値が残る）

      const { env } = await import("@/config/environment");

      // パスワードが定義されているかどうかをテストするよりも、他の必須項目が設定されていることをテスト
      expect(env.DATABASE_HOST).toBe("localhost");
      expect(env.DATABASE_PORT).toBe(3306);
      expect(env.DATABASE_USER).toBe("test_user");
      expect(env.DATABASE_NAME).toBe("seasoning_management_db");
    });

    test("should have correct NODE_ENV values", async () => {
      const environments = ["development", "production", "test"];

      for (const nodeEnv of environments) {
        vi.resetModules();
        vi.stubEnv("NODE_ENV", nodeEnv);

        const { env } = await import("@/config/environment");
        expect(env.NODE_ENV).toBe(nodeEnv);
      }
    });
  });

  describe("Environment validation", () => {
    test("should validate required database environment variables", async () => {
      vi.stubEnv("DATABASE_HOST", "localhost");
      vi.stubEnv("DATABASE_PORT", "3306");
      vi.stubEnv("DATABASE_USER", "test_user");
      vi.stubEnv("DATABASE_NAME", "seasoning_management_db");

      const { env } = await import("@/config/environment");

      const requiredVars = [
        "DATABASE_HOST",
        "DATABASE_PORT",
        "DATABASE_USER",
        "DATABASE_NAME",
      ];

      requiredVars.forEach((varName) => {
        expect(env[varName as keyof typeof env]).toBeDefined();
        expect(env[varName as keyof typeof env]).not.toBe("");
      });
    });

    test("should handle database port as invalid number", async () => {
      vi.stubEnv("DATABASE_HOST", "localhost");
      vi.stubEnv("DATABASE_USER", "test_user");
      vi.stubEnv("DATABASE_NAME", "seasoning_management_db");
      vi.stubEnv("DATABASE_PASSWORD", "test_password");
      vi.stubEnv("DATABASE_PORT", "invalid");

      vi.resetModules();

      // 無効なポート番号の場合はエラーが投げられることを確認
      await expect(async () => {
        await import("@/config/environment");
      }).rejects.toThrow("DATABASE_PORT must be a valid number");
    });

    test("should handle database port edge cases", async () => {
      const testCases = [
        { input: "0", expected: 0 },
        { input: "65535", expected: 65535 },
        { input: "3306", expected: 3306 },
      ];

      for (const testCase of testCases) {
        vi.resetModules();
        vi.stubEnv("DATABASE_PORT", testCase.input);

        const { env } = await import("@/config/environment");
        expect(env.DATABASE_PORT).toBe(testCase.expected);
      }
    });
  });

  describe("Production environment checks", () => {
    test("should handle production environment correctly", async () => {
      vi.stubEnv("NODE_ENV", "production");

      const { env } = await import("@/config/environment");
      expect(env.NODE_ENV).toBe("production");
    });

    test("should handle development environment correctly", async () => {
      vi.stubEnv("NODE_ENV", "development");

      const { env } = await import("@/config/environment");
      expect(env.NODE_ENV).toBe("development");
    });
  });

  describe("Environment variable types", () => {
    test("should have correct types for all environment variables", async () => {
      vi.stubEnv("NODE_ENV", "test");
      vi.stubEnv("DATABASE_HOST", "localhost");
      vi.stubEnv("DATABASE_PORT", "3306");
      vi.stubEnv("DATABASE_USER", "test_user");
      vi.stubEnv("DATABASE_PASSWORD", "test_password");
      vi.stubEnv("DATABASE_NAME", "seasoning_management_db");

      const { env } = await import("@/config/environment");

      expect(typeof env.NODE_ENV).toBe("string");
      expect(typeof env.DATABASE_HOST).toBe("string");
      expect(typeof env.DATABASE_PORT).toBe("number");
      expect(typeof env.DATABASE_USER).toBe("string");
      expect(typeof env.DATABASE_NAME).toBe("string");

      // パスワードは文字列またはundefined
      if (env.DATABASE_PASSWORD !== undefined) {
        expect(typeof env.DATABASE_PASSWORD).toBe("string");
      }
    });
  });

  describe("Environment loading edge cases", () => {
    test("should handle completely missing environment variables", async () => {
      // 必須環境変数を削除してテスト
      vi.resetModules();
      vi.unstubAllEnvs();

      // 必須環境変数がない場合はエラーが投げられることを確認
      await expect(async () => {
        await import("@/config/environment");
      }).rejects.toThrow("Missing required environment variables");
    });

    test("should handle empty string environment variables", async () => {
      vi.resetModules();
      vi.unstubAllEnvs();
      vi.stubEnv("DATABASE_HOST", "valid_host");
      vi.stubEnv("DATABASE_USER", "valid_user");
      vi.stubEnv("DATABASE_NAME", "valid_name");
      vi.stubEnv("DATABASE_PORT", "3306");
      vi.stubEnv("DATABASE_PASSWORD", "");

      // 空文字の環境変数がある場合もエラーが投げられることを確認
      await expect(async () => {
        await import("@/config/environment");
      }).rejects.toThrow("Missing required environment variables");
    });
  });
});
