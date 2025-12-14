import { beforeEach, expect, test, vi } from "vitest";
import { RegisterPurchaseUseCase } from "@/features/seasonings/usecases/register-purchase";
import type {
  ISeasoningImageRepository,
  ISeasoningRepository,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/IDatabaseConnection";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { SeasoningImage } from "@/libs/database/entities/SeasoningImage";
import { SeasoningType } from "@/libs/database/entities/SeasoningType";
import { NotFoundError } from "@/domain/errors";
import type { RegisterPurchaseInput } from "@/features/seasonings/usecases/register-purchase/dto";

let mockSeasoningRepository: ISeasoningRepository;
let mockSeasoningTypeRepository: ISeasoningTypeRepository;
let mockSeasoningImageRepository: ISeasoningImageRepository;
let useCase: RegisterPurchaseUseCase;

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

const createSeasoningEntityWithoutOptionalFields = () =>
  new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
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

  useCase = new RegisterPurchaseUseCase(
    mockSeasoningRepository,
    mockSeasoningTypeRepository,
    mockSeasoningImageRepository
  );
});

test("必須項目のみで購入調味料を作成し、詳細DTOを返す", async () => {
  vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
    createSeasoningTypeEntity()
  );
  vi.mocked(mockSeasoningRepository.create).mockResolvedValue(
    createSeasoningEntityWithoutOptionalFields()
  );

  const input: RegisterPurchaseInput = {
    name: "醤油",
    typeId: 1,
    purchasedAt: "2025-11-01",
  };

  const result = await useCase.execute(input);

  expect(mockSeasoningImageRepository.findById).not.toHaveBeenCalled();

  expect(mockSeasoningRepository.create).toHaveBeenCalledWith({
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: new Date(Date.UTC(2025, 10, 1)),
  });

  expect(result).toMatchObject({
    id: 1,
    name: "醤油",
    typeId: 1,
    typeName: "液体調味料",
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: "2025-11-01",
  });
});

test("全項目を指定して購入調味料を作成し、詳細DTOを返す", async () => {
  vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
    createSeasoningTypeEntity()
  );
  vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(
    createSeasoningImageEntity()
  );
  vi.mocked(mockSeasoningRepository.create).mockResolvedValue(
    createSeasoningEntity()
  );

  const input: RegisterPurchaseInput = {
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

test("存在しない調味料種類の場合、NotFoundErrorを投げる", async () => {
  vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(null);

  const input: RegisterPurchaseInput = {
    name: "醤油",
    typeId: 99,
    purchasedAt: "2025-11-01",
  };

  await expect(useCase.execute(input)).rejects.toBeInstanceOf(NotFoundError);
});

test("存在しない画像IDを指定した場合、NotFoundErrorを投げる", async () => {
  vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
    createSeasoningTypeEntity()
  );
  vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(null);

  const input: RegisterPurchaseInput = {
    name: "醤油",
    typeId: 1,
    imageId: 999,
    purchasedAt: "2025-11-01",
  };

  await expect(useCase.execute(input)).rejects.toBeInstanceOf(NotFoundError);
});

test("無効な日付文字列を渡した場合はエラーになる", async () => {
  vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
    createSeasoningTypeEntity()
  );
  vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(
    createSeasoningImageEntity()
  );

  const input: RegisterPurchaseInput = {
    name: "醤油",
    typeId: 1,
    purchasedAt: "2025-02-30",
  };

  await expect(useCase.execute(input)).rejects.toThrow("無効な日付形式です");
  expect(mockSeasoningRepository.create).not.toHaveBeenCalled();
});
