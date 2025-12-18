/**
 * MySQLSeasoningRepository の基本契約テスト（近接配置）
 */

import { test, expect, beforeEach } from "vitest";
import { MySQLSeasoningRepository } from "..";
import type { IDatabaseConnection } from "@/infrastructure/database/interfaces";
import { createMockConnection } from "@/libs/database/__tests__/config/test-db-config";

let mockConnection: IDatabaseConnection;
let repository: MySQLSeasoningRepository;

beforeEach(async () => {
  mockConnection = await createMockConnection({ minConnections: 2 });
  repository = new MySQLSeasoningRepository(mockConnection);
});

test("[contract] コンストラクタで接続を受け取る", () => {
  expect(repository).toBeDefined();
  expect(repository.connection).toBe(mockConnection);
});

test("[contract] ISeasoningRepository の主要メソッドを実装する", () => {
  expect(typeof repository.create).toBe("function");
  expect(typeof repository.findById).toBe("function");
  expect(typeof repository.findAll).toBe("function");
  expect(typeof repository.update).toBe("function");
  expect(typeof repository.delete).toBe("function");
  expect(typeof repository.findByName).toBe("function");
  expect(typeof repository.findByTypeId).toBe("function");
  expect(typeof repository.findExpiringSoon).toBe("function");
  expect(typeof repository.count).toBe("function");
});

test("[contract] create: 空やnullの name でエラーを投げる", async () => {
  await expect(repository.create({ name: "", typeId: 1 })).rejects.toThrow(
    "調味料名は必須です"
  );
  await expect(
    repository.create({ name: null as unknown as string, typeId: 1 })
  ).rejects.toThrow("調味料名は必須です");
});
