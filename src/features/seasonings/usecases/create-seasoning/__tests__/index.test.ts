import { beforeEach, describe, expect, test, vi } from "vitest";
import { CreateSeasoningUseCase } from "../index";
import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/IDatabaseConnection";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { SeasoningType } from "@/libs/database/entities/SeasoningType";
import { SeasoningImage } from "@/libs/database/entities/SeasoningImage";
import type { CreateSeasoningInput } from "../dto";
import { DuplicateError, NotFoundError } from "@/domain/errors";

let mockSeasoningRepository: ISeasoningRepository;
let mockSeasoningTypeRepository: ISeasoningTypeRepository;
let mockSeasoningImageRepository: ISeasoningImageRepository;
let useCase: CreateSeasoningUseCase;

const createSeasoningEntity = () =>
  new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt: new Date("2025-12-01T00:00:00.000Z"),
    expiresAt: new Date("2025-12-20T00:00:00.000Z"),
    purchasedAt: new Date("2025-11-01T00:00:00.000Z"),
    createdAt: new Date("2025-11-10T12:00:00.000Z"),
    updatedAt: new Date("2025-11-10T12:00:00.000Z"),
  });

const createSeasoningTypeEntity = () =>
  new SeasoningType({
    id: 1,
    name: "液体調味料",
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  });

const createSeasoningImageEntity = () =>
  new SeasoningImage({
    id: 10,
    folderUuid: "123e4567-e89b-12d3-a456-426614174000",
    filename: "soy-sauce.png",
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  });

beforeEach(() => {
  mockSeasoningRepository = {
    connection: {} as IDatabaseConnection,
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByName: vi.fn(),
    findByTypeId: vi.fn(),
    findExpiringSoon: vi.fn(),
    count: vi.fn(),
    getStatistics: vi.fn(),
  };

  mockSeasoningTypeRepository = {
    connection: {} as IDatabaseConnection,
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByName: vi.fn(),
    existsByName: vi.fn(),
    count: vi.fn(),
  };

  mockSeasoningImageRepository = {
    connection: {} as IDatabaseConnection,
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByFolderUuid: vi.fn(),
    generateUuid: vi.fn(),
    generateImagePath: vi.fn(),
    existsByFolderUuid: vi.fn(),
    count: vi.fn(),
  };

  useCase = new CreateSeasoningUseCase(
    mockSeasoningRepository,
    mockSeasoningTypeRepository,
    mockSeasoningImageRepository
  );
});

describe("CreateSeasoningUseCase", () => {
  test("調味料を作成し、詳細DTOを返す", async () => {
    vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
    vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
      createSeasoningTypeEntity()
    );
    vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(
      createSeasoningImageEntity()
    );
    vi.mocked(mockSeasoningRepository.create).mockResolvedValue(
      createSeasoningEntity()
    );

    const input: CreateSeasoningInput = {
      name: "醤油",
      typeId: 1,
      imageId: 10,
      bestBeforeAt: "2025-12-01",
      expiresAt: "2025-12-20",
      purchasedAt: "2025-11-01",
    };

    const result = await useCase.execute(input);

    expect(mockSeasoningRepository.create).toHaveBeenCalledWith({
      name: "醤油",
      typeId: 1,
      imageId: 10,
      bestBeforeAt: new Date(Date.UTC(2025, 11, 1)),
      expiresAt: new Date(Date.UTC(2025, 11, 20)),
      purchasedAt: new Date(Date.UTC(2025, 10, 1)),
    });

    expect(result).toMatchObject({
      id: 1,
      name: "醤油",
      typeId: 1,
      typeName: "液体調味料",
      imageId: 10,
      bestBeforeAt: "2025-12-01",
      expiresAt: "2025-12-20",
      purchasedAt: "2025-11-01",
    });
  });

  test("名前が重複している場合、DuplicateErrorを投げる", async () => {
    vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([
      createSeasoningEntity(),
    ]);

    const input: CreateSeasoningInput = {
      name: "醤油",
      typeId: 1,
    };

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(DuplicateError);
  });

  test("存在しない調味料種類の場合、NotFoundErrorを投げる", async () => {
    vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
    vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(null);

    const input: CreateSeasoningInput = {
      name: "醤油",
      typeId: 99,
    };

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(NotFoundError);
  });

  test("存在しない画像IDを指定した場合、NotFoundErrorを投げる", async () => {
    vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
    vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
      createSeasoningTypeEntity()
    );
    vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(null);

    const input: CreateSeasoningInput = {
      name: "醤油",
      typeId: 1,
      imageId: 999,
    };

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(NotFoundError);
  });

  test("無効な日付文字列を渡した場合はエラーになる", async () => {
    vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
    vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
      createSeasoningTypeEntity()
    );
    vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(
      createSeasoningImageEntity()
    );

    const input: CreateSeasoningInput = {
      name: "醤油",
      typeId: 1,
      bestBeforeAt: "2025-02-30",
    };

    await expect(useCase.execute(input)).rejects.toThrow("Invalid date format");
    expect(mockSeasoningRepository.create).not.toHaveBeenCalled();
  });
});
