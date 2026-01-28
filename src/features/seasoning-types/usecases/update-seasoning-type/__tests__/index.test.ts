import { test, expect, vi } from "vitest";
import { UpdateSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/update-seasoning-type";
import type {
  IDatabaseConnection,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import type { IUnitOfWork } from "@/domain/repositories/i-unit-of-work";
import {
  DuplicateError,
  NotFoundError,
  ValidationError,
} from "@/domain/errors";
import { SeasoningType } from "@/libs/database/entities/seasoning-type";

type RepositoryMocks = {
  repository: ISeasoningTypeRepository;
  findById: ReturnType<typeof vi.fn>;
  existsByName: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
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
  const findById = vi.fn();
  const existsByName = vi.fn();
  const update = vi.fn();

  const repository: ISeasoningTypeRepository = {
    connection: createMockConnection(),
    create: vi.fn(),
    findById,
    findAll: vi.fn(),
    update,
    delete: vi.fn(),
    findByName: vi.fn(),
    existsByName,
    count: vi.fn(),
  };

  return { repository, findById, existsByName, update };
};

const createUnitOfWork = (
  repository: ISeasoningTypeRepository,
): IUnitOfWork => ({
  run: async (work) =>
    work({
      getSeasoningTypeRepository: () => repository,
      getSeasoningRepository: () => ({
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
        countByTypeId: vi.fn(),
        getStatistics: vi.fn(),
      }),
      getSeasoningTemplateRepository: () => ({
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
        countByTypeId: vi.fn(),
      }),
    }),
});

const createSeasoningType = (name = "液体調味料"): SeasoningType =>
  new SeasoningType({
    id: 1,
    name,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  });

test("調味料種類を更新できる", async () => {
  const { repository, findById, existsByName, update } =
    createRepositoryMocks();

  const updatedAt = new Date("2024-02-01T00:00:00.000Z");

  findById.mockResolvedValue(createSeasoningType());
  existsByName.mockResolvedValue(false);
  update.mockResolvedValue({ updatedAt, affectedRows: 1 });

  const useCase = new UpdateSeasoningTypeUseCase(createUnitOfWork(repository));

  const result = await useCase.execute({
    typeId: 1,
    name: "  固形調味料  ",
  });

  expect(existsByName).toHaveBeenCalledWith("固形調味料", 1);
  expect(update).toHaveBeenCalledWith(1, { name: "固形調味料" });
  expect(result).toEqual({
    id: 1,
    name: "固形調味料",
    createdAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
    updatedAt: updatedAt.toISOString(),
  });
});

test("同名更新でも更新結果を返す", async () => {
  const { repository, findById, existsByName, update } =
    createRepositoryMocks();

  const updatedAt = new Date("2024-02-10T00:00:00.000Z");

  findById.mockResolvedValue(createSeasoningType("液体調味料"));
  existsByName.mockResolvedValue(false);
  update.mockResolvedValue({ updatedAt, affectedRows: 1 });

  const useCase = new UpdateSeasoningTypeUseCase(createUnitOfWork(repository));

  const result = await useCase.execute({
    typeId: 1,
    name: "液体調味料",
  });

  expect(update).toHaveBeenCalledWith(1, { name: "液体調味料" });
  expect(result.updatedAt).toBe(updatedAt.toISOString());
});

test("存在しないIDの場合はNotFoundErrorを投げる", async () => {
  const { repository, findById } = createRepositoryMocks();

  findById.mockResolvedValue(null);

  const useCase = new UpdateSeasoningTypeUseCase(createUnitOfWork(repository));

  await expect(
    useCase.execute({ typeId: 999, name: "液体調味料" }),
  ).rejects.toThrow(NotFoundError);
});

test("重複名の場合はDuplicateErrorを投げる", async () => {
  const { repository, findById, existsByName } = createRepositoryMocks();

  findById.mockResolvedValue(createSeasoningType());
  existsByName.mockResolvedValue(true);

  const useCase = new UpdateSeasoningTypeUseCase(createUnitOfWork(repository));

  await expect(
    useCase.execute({ typeId: 1, name: "液体調味料" }),
  ).rejects.toThrow(DuplicateError);
});

test("空文字の場合はValidationErrorを投げる", async () => {
  const { repository } = createRepositoryMocks();
  const useCase = new UpdateSeasoningTypeUseCase(createUnitOfWork(repository));

  await expect(useCase.execute({ typeId: 1, name: "  " })).rejects.toThrow(
    ValidationError,
  );
});
