import { test, expect, vi } from "vitest";
import { CreateSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/create-seasoning-type";
import type {
  IDatabaseConnection,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import type { IUnitOfWork } from "@/domain/repositories/i-unit-of-work";
import { DuplicateError } from "@/domain/errors";

type RepositoryMocks = {
  repository: ISeasoningTypeRepository;
  existsByName: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

const createMockConnection = (): IDatabaseConnection => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(),
  query: vi.fn(),
  beginTransaction: vi.fn(),
  ping: vi.fn(),
  getConfig: vi.fn(),
});

const createRepositoryMocks = (): RepositoryMocks => {
  const existsByName = vi.fn();
  const create = vi.fn();

  const repository: ISeasoningTypeRepository = {
    connection: createMockConnection(),
    create,
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByName: vi.fn(),
    existsByName,
    count: vi.fn(),
  };

  return { repository, existsByName, create };
};

const createUnitOfWork = (repository: ISeasoningTypeRepository): IUnitOfWork => ({
  run: async (work) =>
    work({
      getSeasoningTypeRepository: () => repository,
    }),
});

test("CreateSeasoningTypeUseCase: 調味料種類を作成できる", async () => {
  const { repository, existsByName, create } = createRepositoryMocks();

  existsByName.mockResolvedValue(false);
  create.mockResolvedValue({ id: 1, createdAt: new Date("2024-01-01") });

  const useCase = new CreateSeasoningTypeUseCase(
    createUnitOfWork(repository)
  );

  const result = await useCase.execute({ name: "  液体調味料  " });

  expect(existsByName).toHaveBeenCalledWith("液体調味料");
  expect(result).toEqual({
    id: 1,
    name: "液体調味料",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  });
});

test("CreateSeasoningTypeUseCase: 重複名の場合はDuplicateErrorを投げる", async () => {
  const { repository, existsByName } = createRepositoryMocks();

  existsByName.mockResolvedValue(true);

  const useCase = new CreateSeasoningTypeUseCase(
    createUnitOfWork(repository)
  );

  await expect(useCase.execute({ name: "液体調味料" })).rejects.toThrow(
    DuplicateError
  );
});
