/**
 * @fileoverview ListSeasoningsUseCaseのテスト
 */

import { test, expect, beforeEach, vi } from "vitest";
import type { ISeasoningRepository } from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/i-database-connection";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { ListSeasoningsUseCase } from "../index";
import type { ListSeasoningsInput } from "../dto";

let useCase: ListSeasoningsUseCase;
let mockRepository: ISeasoningRepository;

beforeEach(() => {
  // モックリポジトリの作成
  mockRepository = {
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

  useCase = new ListSeasoningsUseCase(mockRepository);
});

test("ListSeasoningsUseCase.execute: 全調味料を取得してDTOに変換する", async () => {
  // テストデータ作成
  const seasonings = [
    new Seasoning({
      id: 1,
      name: "醤油",
      typeId: 1,
      imageId: null,
      bestBeforeAt: null,
      expiresAt: null,
      purchasedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Seasoning({
      id: 2,
      name: "味噌",
      typeId: 2,
      imageId: null,
      bestBeforeAt: null,
      expiresAt: null,
      purchasedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: seasonings,
    total: 2,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  vi.mocked(mockRepository.getStatistics).mockResolvedValue({
    total: 2,
    expiringSoon: 0,
    expired: 0,
  });

  const input: ListSeasoningsInput = {
    page: 1,
    pageSize: 20,
  };

  const output = await useCase.execute(input);

  expect(output.data).toHaveLength(2);
  expect(output.data[0].name).toBe("醤油");
  expect(output.data[1].name).toBe("味噌");
  expect(output.meta.page).toBe(1);
  expect(output.meta.pageSize).toBe(20);
  expect(output.meta.totalItems).toBe(2);
  expect(output.summary.totalCount).toBe(2);
});

test("ListSeasoningsUseCase.execute: typeIdでフィルタリングする", async () => {
  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  vi.mocked(mockRepository.getStatistics).mockResolvedValue({
    total: 0,
    expiringSoon: 0,
    expired: 0,
  });

  const input: ListSeasoningsInput = {
    page: 1,
    pageSize: 20,
    typeId: 1,
  };

  await useCase.execute(input);

  expect(mockRepository.findAll).toHaveBeenCalledWith(
    expect.objectContaining({
      typeId: 1,
    })
  );
});

test("ListSeasoningsUseCase.execute: searchでフィルタリングする", async () => {
  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  vi.mocked(mockRepository.getStatistics).mockResolvedValue({
    total: 0,
    expiringSoon: 0,
    expired: 0,
  });

  const input: ListSeasoningsInput = {
    page: 1,
    pageSize: 20,
    search: "醤油",
  };

  await useCase.execute(input);

  expect(mockRepository.findAll).toHaveBeenCalledWith(
    expect.objectContaining({
      search: "醤油",
    })
  );
});

test("ListSeasoningsUseCase.execute: サマリーを正しく計算する", async () => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 1);

  const expiringSoonDate = new Date();
  expiringSoonDate.setDate(expiringSoonDate.getDate() + 3);

  const freshDate = new Date();
  freshDate.setDate(freshDate.getDate() + 30);

  const seasonings = [
    new Seasoning({
      id: 1,
      name: "期限切れ",
      typeId: 1,
      imageId: null,
      bestBeforeAt: null,
      expiresAt: expiredDate,
      purchasedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Seasoning({
      id: 2,
      name: "期限間近",
      typeId: 1,
      imageId: null,
      bestBeforeAt: null,
      expiresAt: expiringSoonDate,
      purchasedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Seasoning({
      id: 3,
      name: "新鮮",
      typeId: 1,
      imageId: null,
      bestBeforeAt: null,
      expiresAt: freshDate,
      purchasedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: seasonings,
    total: 3,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  vi.mocked(mockRepository.getStatistics).mockResolvedValue({
    total: 3,
    expiringSoon: 1,
    expired: 1,
  });

  const input: ListSeasoningsInput = {
    page: 1,
    pageSize: 20,
  };

  const output = await useCase.execute(input);

  expect(output.summary.totalCount).toBe(3);
  expect(output.summary.expiredCount).toBe(1);
  expect(output.summary.expiringCount).toBe(1);
});

test("ListSeasoningsUseCase.execute: ページネーションを正しく処理する", async () => {
  const seasonings = Array.from(
    { length: 5 },
    (_, i) =>
      new Seasoning({
        id: i + 1,
        name: `調味料${i + 1}`,
        typeId: 1,
        imageId: null,
        bestBeforeAt: null,
        expiresAt: null,
        purchasedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
  );

  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: seasonings.slice(0, 2),
    total: 5,
    page: 1,
    limit: 2,
    totalPages: 3,
  });

  vi.mocked(mockRepository.getStatistics).mockResolvedValue({
    total: 5,
    expiringSoon: 0,
    expired: 0,
  });

  const input: ListSeasoningsInput = {
    page: 1,
    pageSize: 2,
  };

  const output = await useCase.execute(input);

  expect(output.data).toHaveLength(2);
  expect(output.meta.page).toBe(1);
  expect(output.meta.pageSize).toBe(2);
  expect(output.meta.totalItems).toBe(5);
  expect(output.meta.totalPages).toBe(3);
  expect(output.meta.hasNext).toBe(true);
  expect(output.meta.hasPrevious).toBe(false);
});
