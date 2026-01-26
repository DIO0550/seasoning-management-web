import type {
  ISeasoningRepository,
  ISeasoningTemplateRepository,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";

export interface TransactionContext {
  getSeasoningTypeRepository(): ISeasoningTypeRepository;
  getSeasoningRepository(): ISeasoningRepository;
  getSeasoningTemplateRepository(): ISeasoningTemplateRepository;
}

export interface IUnitOfWork {
  run<T>(work: (ctx: TransactionContext) => Promise<T>): Promise<T>;
}
