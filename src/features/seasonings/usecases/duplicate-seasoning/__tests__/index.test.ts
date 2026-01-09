import { beforeEach, expect, test, vi } from "vitest";
import { DuplicateSeasoningUseCase } from "../index";
import type {
  ISeasoningRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/i-database-connection";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { SeasoningImage } from "@/libs/database/entities/seasoning-image";
import type { DuplicateSeasoningInput } from "../dto";
import { DuplicateError, NotFoundError } from "@/domain/errors";

let mockSeasoningRepository: ISeasoningRepository;
let mockSeasoningImageRepository: ISeasoningImageRepository;
let useCase: DuplicateSeasoningUseCase;

const createOriginalSeasoning = () =>
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

const createDuplicatedSeasoning = (overrides?: Partial<Seasoning>) => {
  const original = createOriginalSeasoning();
  return new Seasoning({
    id: 2,
    name: overrides?.name ?? original.name,
    typeId: original.typeId,
    imageId:
      overrides?.imageId !== undefined ? overrides.imageId : original.imageId,
    bestBeforeAt:
      overrides?.bestBeforeAt !== undefined
        ? overrides.bestBeforeAt
        : original.bestBeforeAt,
    expiresAt:
      overrides?.expiresAt !== undefined
        ? overrides.expiresAt
        : original.expiresAt,
    purchasedAt:
      overrides?.purchasedAt !== undefined
        ? overrides.purchasedAt
        : original.purchasedAt,
    createdAt: new Date("2025-11-11T12:00:00.000Z"),
    updatedAt: new Date("2025-11-11T12:00:00.000Z"),
  });
};

const createSeasoningImageEntity = () =>
  new SeasoningImage({
    id: 20,
    folderUuid: "123e4567-e89b-12d3-a456-426614174001",
    filename: "new-image.png",
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

  useCase = new DuplicateSeasoningUseCase(
    mockSeasoningRepository,
    mockSeasoningImageRepository
  );
});

test("元データをすべてコピーして新規調味料を作成する", async () => {
  const original = createOriginalSeasoning();
  const duplicated = createDuplicatedSeasoning({ name: "新しい醤油" });

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
  vi.mocked(mockSeasoningRepository.create).mockResolvedValue(duplicated);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
    name: "新しい醤油",
  };

  const result = await useCase.execute(input);

  expect(mockSeasoningRepository.findById).toHaveBeenCalledWith(1);
  expect(mockSeasoningRepository.findByName).toHaveBeenCalledWith("新しい醤油");
  expect(mockSeasoningRepository.create).toHaveBeenCalledWith({
    name: "新しい醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt: original.bestBeforeAt,
    expiresAt: original.expiresAt,
    purchasedAt: original.purchasedAt,
  });

  expect(result).toMatchObject({
    id: 2,
    name: "新しい醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt: "2025-12-01",
    expiresAt: "2025-12-20",
    purchasedAt: "2025-11-01",
  });
});

test("名前を指定しない場合、元の名前で重複チェックを行う", async () => {
  const original = createOriginalSeasoning();

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([original]);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
  };

  await expect(useCase.execute(input)).rejects.toThrow(DuplicateError);
  expect(mockSeasoningRepository.findByName).toHaveBeenCalledWith("醤油");
});

test("purchasedAt, bestBeforeAt, expiresAtを部分的に上書きできる", async () => {
  const original = createOriginalSeasoning();
  const duplicated = createDuplicatedSeasoning({
    name: "新しい醤油",
    purchasedAt: new Date("2025-12-01T00:00:00.000Z"),
  });

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
  vi.mocked(mockSeasoningRepository.create).mockResolvedValue(duplicated);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
    name: "新しい醤油",
    purchasedAt: "2025-12-01",
  };

  await useCase.execute(input);

  expect(mockSeasoningRepository.create).toHaveBeenCalledWith({
    name: "新しい醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt: original.bestBeforeAt,
    expiresAt: original.expiresAt,
    purchasedAt: new Date(Date.UTC(2025, 11, 1)),
  });
});

test("imageIdを上書きできる", async () => {
  const original = createOriginalSeasoning();
  const duplicated = createDuplicatedSeasoning({
    name: "新しい醤油",
    imageId: 20,
  });

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
  vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(
    createSeasoningImageEntity()
  );
  vi.mocked(mockSeasoningRepository.create).mockResolvedValue(duplicated);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
    name: "新しい醤油",
    imageId: 20,
  };

  await useCase.execute(input);

  expect(mockSeasoningImageRepository.findById).toHaveBeenCalledWith(20);
  expect(mockSeasoningRepository.create).toHaveBeenCalledWith(
    expect.objectContaining({ imageId: 20 })
  );
});

test("imageIdをnullに設定できる", async () => {
  const original = createOriginalSeasoning();
  const duplicated = createDuplicatedSeasoning({
    name: "新しい醤油",
    imageId: null,
  });

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
  vi.mocked(mockSeasoningRepository.create).mockResolvedValue(duplicated);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
    name: "新しい醤油",
    imageId: null,
  };

  await useCase.execute(input);

  expect(mockSeasoningImageRepository.findById).not.toHaveBeenCalled();
  expect(mockSeasoningRepository.create).toHaveBeenCalledWith(
    expect.objectContaining({ imageId: null })
  );
});

test("元データが存在しない場合、NotFoundErrorを投げる", async () => {
  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(null);

  const input: DuplicateSeasoningInput = {
    seasoningId: 999,
    name: "新しい醤油",
  };

  await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
  expect(mockSeasoningRepository.findById).toHaveBeenCalledWith(999);
});

test("名前が重複している場合、DuplicateErrorを投げる", async () => {
  const original = createOriginalSeasoning();
  const existing = new Seasoning({
    id: 100,
    name: "重複した醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([existing]);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
    name: "重複した醤油",
  };

  await expect(useCase.execute(input)).rejects.toThrow(DuplicateError);
});

test("指定された画像IDが存在しない場合、NotFoundErrorを投げる", async () => {
  const original = createOriginalSeasoning();

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
  vi.mocked(mockSeasoningImageRepository.findById).mockResolvedValue(null);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
    name: "新しい醤油",
    imageId: 999,
  };

  await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
});

test("日付フィールドをnullに設定できる", async () => {
  const original = createOriginalSeasoning();
  const duplicated = createDuplicatedSeasoning({
    name: "新しい醤油",
    bestBeforeAt: null,
    expiresAt: null,
  });

  vi.mocked(mockSeasoningRepository.findById).mockResolvedValue(original);
  vi.mocked(mockSeasoningRepository.findByName).mockResolvedValue([]);
  vi.mocked(mockSeasoningRepository.create).mockResolvedValue(duplicated);

  const input: DuplicateSeasoningInput = {
    seasoningId: 1,
    name: "新しい醤油",
    bestBeforeAt: null,
    expiresAt: null,
  };

  await useCase.execute(input);

  expect(mockSeasoningRepository.create).toHaveBeenCalledWith(
    expect.objectContaining({
      bestBeforeAt: null,
      expiresAt: null,
    })
  );
});
