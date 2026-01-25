import { test, expect, vi } from "vitest";
import { GetSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/get-seasoning-type";
import type {
  IDatabaseConnection,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import { SeasoningType } from "@/libs/database/entities/seasoning-type";
import { NotFoundError } from "@/domain/errors";

type RepositoryMocks = {
  repository: ISeasoningTypeRepository;
  findById: ReturnType<typeof vi.fn>;
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

  const repository: ISeasoningTypeRepository = {
    connection: createMockConnection(),
    create: vi.fn(),
    findById,
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByName: vi.fn(),
    existsByName: vi.fn(),
    count: vi.fn(),
  };

  return { repository, findById };
};

test("GetSeasoningTypeUseCase: 調味料種類の詳細を取得できる", async () => {
  const { repository, findById } = createRepositoryMocks();

  findById.mockResolvedValue(
    new SeasoningType({
      id: 1,
      name: "液体調味料",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    }),
  );

  const useCase = new GetSeasoningTypeUseCase(repository);

  const result = await useCase.execute({ typeId: 1 });

  expect(result).toEqual({
    id: 1,
    name: "液体調味料",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  });
});

test("GetSeasoningTypeUseCase: 見つからない場合はNotFoundErrorを投げる", async () => {
  const { repository, findById } = createRepositoryMocks();

  findById.mockResolvedValue(null);

  const useCase = new GetSeasoningTypeUseCase(repository);

  await expect(useCase.execute({ typeId: 999 })).rejects.toThrow(NotFoundError);
});
