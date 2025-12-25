import type { IUnitOfWork, TransactionContext } from "@/domain/repositories/i-unit-of-work";
import type {
  IDatabaseConnection,
  ITransaction,
  QueryResult,
  TransactionOptions,
} from "@/infrastructure/database/interfaces";
import type { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { MySQLSeasoningTypeRepository } from "@/infrastructure/database/repositories/mysql";

class TransactionConnection implements IDatabaseConnection {
  constructor(
    private readonly connection: IDatabaseConnection,
    private readonly transaction: ITransaction
  ) {}

  async connect(): Promise<void> {
    await this.connection.connect();
  }

  async disconnect(): Promise<void> {
    await this.connection.disconnect();
  }

  isConnected(): boolean {
    return this.connection.isConnected();
  }

  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    return this.transaction.query<T>(sql, params);
  }

  async beginTransaction(_options?: TransactionOptions): Promise<ITransaction> {
    throw new Error("ネストしたトランザクションはサポートしていません");
  }

  async ping(): Promise<boolean> {
    return this.connection.ping();
  }

  getConfig() {
    return this.connection.getConfig();
  }
}

export class MySQLUnitOfWork implements IUnitOfWork {
  constructor(private readonly connectionManager: ConnectionManager) {}

  async run<T>(work: (ctx: TransactionContext) => Promise<T>): Promise<T> {
    const connection = await this.connectionManager.getConnection();
    const transaction = await connection.beginTransaction();
    const transactionConnection = new TransactionConnection(
      connection,
      transaction
    );

    const context: TransactionContext = {
      getSeasoningTypeRepository: () =>
        new MySQLSeasoningTypeRepository(transactionConnection),
    };

    try {
      const result = await work(context);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      await this.connectionManager.releaseConnection(connection);
    }
  }
}
