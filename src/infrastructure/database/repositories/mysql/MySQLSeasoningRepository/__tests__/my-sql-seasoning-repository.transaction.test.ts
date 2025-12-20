import { expect, test, vi } from "vitest";
import { MySQLSeasoningRepository } from "..";
import type {
  ConnectionConfig,
  IDatabaseConnection,
  QueryResult,
  TransactionStatus,
} from "@/infrastructure/database/interfaces";
import type { ITransaction } from "@/infrastructure/database/shared/transaction";

const dummyConfig: ConnectionConfig = {
  host: "localhost",
  port: 3306,
  database: "seasoning_management_db",
  username: "root",
  password: "",
};

const createQueryResult = <T>(
  partial: Partial<QueryResult<T>> & Pick<QueryResult<T>, "rows">
): QueryResult<T> => {
  return {
    rows: partial.rows,
    rowsAffected: partial.rowsAffected ?? 0,
    insertId: partial.insertId ?? null,
    metadata: partial.metadata,
  };
};

test("MySQLSeasoningRepository.create: 成功時はcommitされる", async () => {
  const transaction: ITransaction = {
    query: vi.fn(),
    commit: vi.fn(async () => undefined),
    rollback: vi.fn(async () => undefined),
    getStatus: vi.fn((): TransactionStatus => "ACTIVE"),
    isActive: vi.fn(() => true),
  };

  vi.mocked(transaction.query)
    .mockResolvedValueOnce(createQueryResult({ rows: [], insertId: 123 }))
    .mockResolvedValueOnce(
      createQueryResult({
        rows: [
          {
            id: 123,
            name: "醤油",
            type_id: 1,
            image_id: null,
            best_before_at: null,
            expires_at: null,
            purchased_at: new Date("2025-11-01T00:00:00.000Z"),
            created_at: new Date("2025-11-10T00:00:00.000Z"),
            updated_at: new Date("2025-11-10T00:00:00.000Z"),
          },
        ],
      })
    );

  const connection: IDatabaseConnection = {
    connect: vi.fn(async () => undefined),
    disconnect: vi.fn(async () => undefined),
    isConnected: vi.fn(() => true),
    query: vi.fn(async () => createQueryResult({ rows: [] })),
    beginTransaction: vi.fn(async () => transaction),
    ping: vi.fn(async () => true),
    getConfig: vi.fn(() => dummyConfig),
  };

  const repository = new MySQLSeasoningRepository(connection);
  const result = await repository.create({
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: new Date(Date.UTC(2025, 10, 1)),
  });

  expect(result.id).toBe(123);
  expect(vi.mocked(connection.beginTransaction)).toHaveBeenCalledTimes(1);
  expect(vi.mocked(transaction.query)).toHaveBeenCalled();
  expect(vi.mocked(transaction.commit)).toHaveBeenCalledTimes(1);
  expect(vi.mocked(transaction.rollback)).not.toHaveBeenCalled();
});

test("MySQLSeasoningRepository.create: INSERT後の失敗時はrollbackされる", async () => {
  const transaction: ITransaction = {
    query: vi.fn(),
    commit: vi.fn(async () => undefined),
    rollback: vi.fn(async () => undefined),
    getStatus: vi.fn((): TransactionStatus => "ACTIVE"),
    isActive: vi.fn(() => true),
  };

  vi.mocked(transaction.query)
    .mockResolvedValueOnce(createQueryResult({ rows: [], insertId: 123 }))
    .mockRejectedValueOnce(new Error("select failed"));

  const connection: IDatabaseConnection = {
    connect: vi.fn(async () => undefined),
    disconnect: vi.fn(async () => undefined),
    isConnected: vi.fn(() => true),
    query: vi.fn(async () => createQueryResult({ rows: [] })),
    beginTransaction: vi.fn(async () => transaction),
    ping: vi.fn(async () => true),
    getConfig: vi.fn(() => dummyConfig),
  };

  const repository = new MySQLSeasoningRepository(connection);

  await expect(
    repository.create({
      name: "醤油",
      typeId: 1,
      imageId: null,
      bestBeforeAt: null,
      expiresAt: null,
      purchasedAt: new Date(Date.UTC(2025, 10, 1)),
    })
  ).rejects.toThrow();

  expect(vi.mocked(connection.beginTransaction)).toHaveBeenCalledTimes(1);
  expect(vi.mocked(transaction.query)).toHaveBeenCalled();
  expect(vi.mocked(transaction.commit)).not.toHaveBeenCalled();
  expect(vi.mocked(transaction.rollback)).toHaveBeenCalledTimes(1);
});
