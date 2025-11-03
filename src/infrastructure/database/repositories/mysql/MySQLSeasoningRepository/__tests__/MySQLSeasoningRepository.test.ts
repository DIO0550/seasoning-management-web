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

test("[scoped] connection プロパティが公開されている", () => {
  expect(repository.connection).toBe(mockConnection);
});

test("[scoped] ISeasoningRepository の主要メソッドを実装している", () => {
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
