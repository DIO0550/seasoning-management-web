import { beforeEach, expect, test, vi } from "vitest";
import { UpdateSeasoningUseCase } from "../index";
import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/i-database-connection";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { SeasoningType } from "@/libs/database/entities/seasoning-type";
import { SeasoningImage } from "@/libs/database/entities/seasoning-image";
import type { UpdateSeasoningInput } from "../dto";
import { NotFoundError } from "@/domain/errors";

let mockSeasoningRepository: ISeasoningRepository;
let mockSeasoningTypeRepository: ISeasoningTypeRepository;
let mockSeasoningImageRepository: ISeasoningImageRepository;
let useCase: UpdateSeasoningUseCase;

const createSeasoningEntity = (overrides?: Partial<Seasoning>) =>
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
    ...overrides,
  });

const createSeasoningTypeEntity = () =>
  new SeasoningType({
    id: 1,
    name: "液体調味料",
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

  useCase = new UpdateSeasoningUseCase(
    mockSeasoningRepository,
    mockSeasoningTypeRepository,
    mockSeasoningImageRepository
  );
});

test("正常系: 名前のみを更新した場合、更新後のデータを返す", async () => {
  const originalEntity = createSeasoningEntity();
  const updatedAt = new Date("2025-11-11T00:00:00.000Z");

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValueOnce(
    originalEntity
  );
  vi.mocked(mockSeasoningRepository.update).mockResolvedValue({
    affectedRows: 1,
    updatedAt,
  });

  const input: UpdateSeasoningInput = {
    seasoningId: 1,
    name: "濃口醤油",
  };

  const result = await useCase.execute(input);

  expect(result.id).toBe(1);
  expect(result.name).toBe("濃口醤油");
  expect(mockSeasoningRepository.update).toHaveBeenCalledWith(1, {
    name: "濃口醤油",
  });
  expect(mockSeasoningRepository.findById).toHaveBeenCalledTimes(1);
});

test("正常系: 複数フィールドを同時に更新した場合、更新後のデータを返す", async () => {
  const originalEntity = createSeasoningEntity();
  const updatedAt = new Date("2025-11-11T00:00:00.000Z");

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValueOnce(
    originalEntity
  );
  vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(
    createSeasoningTypeEntity()
  );
  vi.mocked(mockSeasoningRepository.update).mockResolvedValue({
    affectedRows: 1,
    updatedAt,
  });

  const input: UpdateSeasoningInput = {
    seasoningId: 1,
    name: "濃口醤油",
    typeId: 1,
    bestBeforeAt: "2026-06-01",
  };

  const result = await useCase.execute(input);

  expect(result.id).toBe(1);
  expect(result.name).toBe("濃口醤油");
  expect(result.bestBeforeAt).toBe("2026-06-01");
  expect(mockSeasoningRepository.findById).toHaveBeenCalledTimes(1);
});

test("正常系: imageIdをnullに更新した場合、画像が削除される", async () => {
  const originalEntity = createSeasoningEntity();
  const updatedAt = new Date("2025-11-11T00:00:00.000Z");

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValueOnce(
    originalEntity
  );
  vi.mocked(mockSeasoningRepository.update).mockResolvedValue({
    affectedRows: 1,
    updatedAt,
  });

  const input: UpdateSeasoningInput = {
    seasoningId: 1,
    imageId: null,
  };

  const result = await useCase.execute(input);

  expect(result.imageId).toBeNull();
  expect(mockSeasoningRepository.update).toHaveBeenCalledWith(1, {
    imageId: null,
  });
  expect(mockSeasoningRepository.findById).toHaveBeenCalledTimes(1);
});

test("正常系: imageIdを新しい値に更新した場合、画像が変更される", async () => {
  const originalEntity = createSeasoningEntity();
  const updatedAt = new Date("2025-11-11T00:00:00.000Z");

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValueOnce(
    originalEntity
  );
  vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(
    new SeasoningImage({
      id: 20,
      folderUuid: "550e8400-e29b-41d4-a716-446655440001",
      filename: "new-image.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  );
  vi.mocked(mockSeasoningRepository.update).mockResolvedValue({
    affectedRows: 1,
    updatedAt,
  });

  const input: UpdateSeasoningInput = {
    seasoningId: 1,
    imageId: 20,
  };

  const result = await useCase.execute(input);

  expect(result.imageId).toBe(20);
  expect(mockSeasoningRepository.findById).toHaveBeenCalledTimes(1);
});

test("異常系: 存在しない調味料IDの場合、NotFoundErrorをスローする", async () => {
  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(null);

  const input: UpdateSeasoningInput = {
    seasoningId: 999,
    name: "更新名",
  };

  await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
  await expect(useCase.execute(input)).rejects.toThrow("seasoning");
});

test("異常系: 存在しない調味料種類IDの場合、NotFoundErrorをスローする", async () => {
  const originalEntity = createSeasoningEntity();

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(originalEntity);
  vi.mocked(mockSeasoningTypeRepository.findById).mockResolvedValue(null);

  const input: UpdateSeasoningInput = {
    seasoningId: 1,
    typeId: 999,
  };

  await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
  await expect(useCase.execute(input)).rejects.toThrow("seasoning-type");
});

test("異常系: 存在しない画像IDの場合、NotFoundErrorをスローする", async () => {
  const originalEntity = createSeasoningEntity();

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(originalEntity);
  vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(null);

  const input: UpdateSeasoningInput = {
    seasoningId: 1,
    imageId: 999,
  };

  await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
  await expect(useCase.execute(input)).rejects.toThrow("seasoning-image");
});
