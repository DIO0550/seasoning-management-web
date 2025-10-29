import type {
  ConnectionConfig,
  IDatabaseConnection,
} from "@/libs/database/interfaces/core";
import { MockDatabaseConnection } from "@/libs/database/__tests__/mocks";

export const DEFAULT_TEST_DB_CONFIG: ConnectionConfig = {
  host: "localhost",
  port: 3306,
  database: "test_db",
  username: "test_user",
  maxConnections: 10,
  minConnections: 1,
};

export async function createMockConnection(
  overrides?: Partial<ConnectionConfig>
): Promise<IDatabaseConnection> {
  const config: ConnectionConfig = { ...DEFAULT_TEST_DB_CONFIG, ...overrides };
  const conn = new MockDatabaseConnection(config);
  await conn.connect();
  return conn;
}
