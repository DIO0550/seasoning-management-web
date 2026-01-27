import { test, expect, vi } from "vitest";
import { DeleteSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/delete-seasoning-type";
import type {
  ISeasoningRepository,
  ISeasoningTemplateRepository,
  ISeasoningTypeRepository,
  IDatabaseConnection,
} from "@/infrastructure/database/interfaces";
import type { IUnitOfWork } from "@/domain/repositories/i-unit-of-work";
import { ConflictError, NotFoundError } from "@/domain/errors";
import { SeasoningType } from "@/libs/database/entities/seasoning-type";

const createMockConnection = (): IDatabaseConnection => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(),
  query: vi.fn(),
  beginTransaction: vi.fn(),
  ping: vi.fn(),
  getConfig: vi.fn(),
});

type SeasoningTypeRepositoryMocks = {
  repository: ISeasoningTypeRepository;
  findById: ReturnType<typeof vi.fn>;
  deleteById: ReturnType<typeof vi.fn>;
};

type SeasoningRepositoryMocks = {
  repository: ISeasoningRepository;
  countByTypeId: ReturnType<typeof vi.fn>;
};

type SeasoningTemplateRepositoryMocks = {
  repository: ISeasoningTemplateRepository;
  countByTypeId: ReturnType<typeof vi.fn>;
};

const createSeasoningTypeRepositoryMocks = (): SeasoningTypeRepositoryMocks => {
  const findById = vi.fn();
  const deleteById = vi.fn();

  const repository: ISeasoningTypeRepository = {
    connection: createMockConnection(),
    create: vi.fn(),
    findById,
    findAll: vi.fn(),
    update: vi.fn(),
    delete: deleteById,
    findByName: vi.fn(),
    existsByName: vi.fn(),
    count: vi.fn(),
  };

  return { repository, findById, deleteById };
};

const createSeasoningRepositoryMocks = (): SeasoningRepositoryMocks => {
  const countByTypeId = vi.fn();

  const repository: ISeasoningRepository = {
    connection: createMockConnection(),
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByName: vi.fn(),
    findByTypeId: vi.fn(),
    findExpiringSoon: vi.fn(),
    count: vi.fn(),
    countByTypeId,
    getStatistics: vi.fn(),
  };

  return { repository, countByTypeId };
};

const createSeasoningTemplateRepositoryMocks =
  (): SeasoningTemplateRepositoryMocks => {
    const countByTypeId = vi.fn();

    const repository: ISeasoningTemplateRepository = {
      connection: createMockConnection(),
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByName: vi.fn(),
      findByTypeId: vi.fn(),
      createSeasoningFromTemplate: vi.fn(),
      existsByName: vi.fn(),
      count: vi.fn(),
      countByTypeId,
    };

    return { repository, countByTypeId };
  };

const createUnitOfWork = (
  seasoningTypeRepository: ISeasoningTypeRepository,
  seasoningRepository: ISeasoningRepository,
  seasoningTemplateRepository: ISeasoningTemplateRepository,
): IUnitOfWork => ({
  run: async (work) =>
    work({
      getSeasoningTypeRepository: () => seasoningTypeRepository,
      getSeasoningRepository: () => seasoningRepository,
      getSeasoningTemplateRepository: () => seasoningTemplateRepository,
    }),
});

const createSeasoningType = (): SeasoningType =>
  new SeasoningType({
    id: 1,
    name: "液体調味料",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  });

test("DeleteSeasoningTypeUseCase: 調味料種類を削除できる", async () => {
  const { repository, findById, deleteById } =
    createSeasoningTypeRepositoryMocks();
  const seasoningRepository = createSeasoningRepositoryMocks();
  const seasoningTemplateRepository = createSeasoningTemplateRepositoryMocks();

  findById.mockResolvedValue(createSeasoningType());
  seasoningRepository.countByTypeId.mockResolvedValue(0);
  seasoningTemplateRepository.countByTypeId.mockResolvedValue(0);
  deleteById.mockResolvedValue({ affectedRows: 1 });

  const useCase = new DeleteSeasoningTypeUseCase(
    createUnitOfWork(
      repository,
      seasoningRepository.repository,
      seasoningTemplateRepository.repository,
    ),
  );

  await useCase.execute({ typeId: 1 });

  expect(deleteById).toHaveBeenCalledWith(1);
});

test("DeleteSeasoningTypeUseCase: 存在しない場合はNotFoundErrorを投げる", async () => {
  const { repository, findById } = createSeasoningTypeRepositoryMocks();
  const seasoningRepository = createSeasoningRepositoryMocks();
  const seasoningTemplateRepository = createSeasoningTemplateRepositoryMocks();

  findById.mockResolvedValue(null);

  const useCase = new DeleteSeasoningTypeUseCase(
    createUnitOfWork(
      repository,
      seasoningRepository.repository,
      seasoningTemplateRepository.repository,
    ),
  );

  await expect(useCase.execute({ typeId: 999 })).rejects.toThrow(NotFoundError);
});

test("DeleteSeasoningTypeUseCase: 関連調味料がある場合はConflictErrorを投げる", async () => {
  const { repository, findById, deleteById } =
    createSeasoningTypeRepositoryMocks();
  const seasoningRepository = createSeasoningRepositoryMocks();
  const seasoningTemplateRepository = createSeasoningTemplateRepositoryMocks();

  findById.mockResolvedValue(createSeasoningType());
  seasoningRepository.countByTypeId.mockResolvedValue(1);
  seasoningTemplateRepository.countByTypeId.mockResolvedValue(0);

  const useCase = new DeleteSeasoningTypeUseCase(
    createUnitOfWork(
      repository,
      seasoningRepository.repository,
      seasoningTemplateRepository.repository,
    ),
  );

  await expect(useCase.execute({ typeId: 1 })).rejects.toThrow(ConflictError);
  expect(deleteById).not.toHaveBeenCalled();
});

test(
  "DeleteSeasoningTypeUseCase: 関連テンプレートがある場合はConflictErrorを投げる",
  async () => {
    const { repository, findById, deleteById } =
      createSeasoningTypeRepositoryMocks();
    const seasoningRepository = createSeasoningRepositoryMocks();
    const seasoningTemplateRepository = createSeasoningTemplateRepositoryMocks();

    findById.mockResolvedValue(createSeasoningType());
    seasoningRepository.countByTypeId.mockResolvedValue(0);
    seasoningTemplateRepository.countByTypeId.mockResolvedValue(1);

    const useCase = new DeleteSeasoningTypeUseCase(
      createUnitOfWork(
        repository,
        seasoningRepository.repository,
        seasoningTemplateRepository.repository,
      ),
    );

    await expect(useCase.execute({ typeId: 1 })).rejects.toThrow(ConflictError);
    expect(deleteById).not.toHaveBeenCalled();
  },
);

test("DeleteSeasoningTypeUseCase: 外部キー制約違反はConflictErrorに変換する", async () => {
  const { repository, findById, deleteById } =
    createSeasoningTypeRepositoryMocks();
  const seasoningRepository = createSeasoningRepositoryMocks();
  const seasoningTemplateRepository = createSeasoningTemplateRepositoryMocks();

  findById.mockResolvedValue(createSeasoningType());
  seasoningRepository.countByTypeId.mockResolvedValue(0);
  seasoningTemplateRepository.countByTypeId.mockResolvedValue(0);

  deleteById.mockRejectedValue({
    context: {
      error: {
        code: "ER_ROW_IS_REFERENCED_2",
        errno: 1451,
        sqlState: "23000",
      },
    },
  });

  const useCase = new DeleteSeasoningTypeUseCase(
    createUnitOfWork(
      repository,
      seasoningRepository.repository,
      seasoningTemplateRepository.repository,
    ),
  );

  await expect(useCase.execute({ typeId: 1 })).rejects.toThrow(ConflictError);
});
