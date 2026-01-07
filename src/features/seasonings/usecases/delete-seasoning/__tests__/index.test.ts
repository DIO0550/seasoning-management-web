import { test, expect, beforeEach, vi } from "vitest";
import type { ISeasoningRepository } from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/i-database-connection";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { NotFoundError } from "@/domain/errors/not-found-error";
import { DeleteSeasoningUseCase } from "@/features/seasonings/usecases/delete-seasoning";

let useCase: DeleteSeasoningUseCase;
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

  useCase = new DeleteSeasoningUseCase(mockRepository);
});

test("execute: 存在するIDの場合、調味料を削除する", async () => {
  const now = new Date();

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  vi.mocked(mockRepository.findById).mockResolvedValue(seasoning);
  vi.mocked(mockRepository.delete).mockResolvedValue({ affectedRows: 1 });

  await useCase.execute({ seasoningId: 1 });

  expect(mockRepository.findById).toHaveBeenCalledWith(1);
  expect(mockRepository.delete).toHaveBeenCalledWith(1);
});

test("execute: 存在しないIDの場合、NotFoundErrorをスローする", async () => {
  vi.mocked(mockRepository.findById).mockResolvedValue(null);

  await expect(useCase.execute({ seasoningId: 999 })).rejects.toThrow(
    NotFoundError
  );
  expect(mockRepository.findById).toHaveBeenCalledWith(999);
  expect(mockRepository.delete).not.toHaveBeenCalled();
});
