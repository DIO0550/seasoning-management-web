import type { ISeasoningTypeRepository } from "@/infrastructure/database/interfaces";

export interface TransactionContext {
  getSeasoningTypeRepository(): ISeasoningTypeRepository;
}

export interface IUnitOfWork {
  run<T>(work: (ctx: TransactionContext) => Promise<T>): Promise<T>;
}
