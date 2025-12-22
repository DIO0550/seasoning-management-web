import { test, expect, beforeEach, vi } from "vitest";
import type { ISeasoningRepository } from "@/libs/database/interfaces/repositories/i-seasoning-repository";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/i-database-connection";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { NotFoundError } from "@/domain/errors/not-found-error";
import { GetSeasoningUseCase } from "@/features/seasonings/usecases/get-seasoning";

let useCase: GetSeasoningUseCase;
let mockRepository: ISeasoningRepository;

beforeEach(() => {
  mockRepository = {
    connection: {} as IDatabaseConnection,
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as unknown as ISeasoningRepository;

  useCase = new GetSeasoningUseCase(mockRepository);
});

test("execute: 存在するIDの場合、調味料詳細を返す", async () => {
  const now = new Date();
  const bestBeforeAt = new Date("2025-12-31T00:00:00.000Z");
  const purchasedAt = new Date("2025-01-01T00:00:00.000Z");

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: bestBeforeAt,
    expiresAt: null,
    purchasedAt: purchasedAt,
    createdAt: now,
    updatedAt: now,
  });

  vi.mocked(mockRepository.findById).mockResolvedValue(seasoning);

  const result = await useCase.execute({ seasoningId: 1 });

  expect(mockRepository.findById).toHaveBeenCalledWith(1);
  expect(result).toEqual({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: bestBeforeAt.toISOString(),
    expiresAt: null,
    purchasedAt: purchasedAt.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiryStatus: expect.any(String),
    daysUntilExpiry: expect.any(Number),
  });
});

test("execute: 存在しないIDの場合、NotFoundErrorをスローする", async () => {
  vi.mocked(mockRepository.findById).mockResolvedValue(null);

  await expect(useCase.execute({ seasoningId: 999 })).rejects.toThrow(
    NotFoundError
  );
  expect(mockRepository.findById).toHaveBeenCalledWith(999);
});
