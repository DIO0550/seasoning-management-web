/**
 * @fileoverview ListSeasoningTemplatesUseCaseのテスト
 */

import { beforeEach, expect, test, vi } from "vitest";
import type { ISeasoningTemplateRepository } from "@/infrastructure/database/interfaces";
import type { IDatabaseConnection } from "@/libs/database/interfaces/core/i-database-connection";
import { SeasoningTemplate } from "@/libs/database/entities/seasoning-template";
import { ListSeasoningTemplatesUseCase } from "@/features/seasoning-templates/usecases/list-seasoning-templates";
import type { ListSeasoningTemplatesInput } from "@/features/seasoning-templates/usecases/list-seasoning-templates/dto";

let mockRepository: ISeasoningTemplateRepository;

beforeEach(() => {
  mockRepository = {
    connection: {} as IDatabaseConnection,
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
  };

});

test("ListSeasoningTemplatesUseCase.execute: テンプレート一覧をDTOに変換して返す", async () => {
  const createdAt = new Date("2024-01-01T00:00:00.000Z");
  const updatedAt = new Date("2024-01-02T00:00:00.000Z");
  const templates = [
    new SeasoningTemplate({
      id: 1,
      name: "醤油",
      typeId: 1,
      imageId: null,
      createdAt,
      updatedAt,
    }),
    new SeasoningTemplate({
      id: 2,
      name: "味噌",
      typeId: 2,
      imageId: 5,
      createdAt,
      updatedAt,
    }),
  ];

  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: templates,
    total: 2,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const input: ListSeasoningTemplatesInput = {
    page: 1,
    pageSize: 20,
  };

  const output = await ListSeasoningTemplatesUseCase.execute(
    mockRepository,
    input,
  );

  expect(output.data).toHaveLength(2);
  expect(output.data[0]).toEqual({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  });
  expect(output.meta.totalItems).toBe(2);
});

test("ListSeasoningTemplatesUseCase.execute: searchでフィルタリングする", async () => {
  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const input: ListSeasoningTemplatesInput = {
    page: 1,
    pageSize: 20,
    search: "醤油",
  };

  await ListSeasoningTemplatesUseCase.execute(mockRepository, input);

  expect(mockRepository.findAll).toHaveBeenCalledWith(
    expect.objectContaining({
      search: "醤油",
    }),
  );
});

test("ListSeasoningTemplatesUseCase.execute: ページネーションメタ情報を正しく計算する", async () => {
  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: [],
    total: 5,
    page: 2,
    limit: 2,
    totalPages: 3,
  });

  const input: ListSeasoningTemplatesInput = {
    page: 2,
    pageSize: 2,
  };

  const output = await ListSeasoningTemplatesUseCase.execute(
    mockRepository,
    input,
  );

  expect(output.meta.page).toBe(2);
  expect(output.meta.pageSize).toBe(2);
  expect(output.meta.totalItems).toBe(5);
  expect(output.meta.totalPages).toBe(3);
  expect(output.meta.hasNext).toBe(true);
  expect(output.meta.hasPrevious).toBe(true);
});

test("ListSeasoningTemplatesUseCase.execute: 総件数が0の場合はhasNext/hasPreviousがfalse", async () => {
  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const input: ListSeasoningTemplatesInput = {
    page: 1,
    pageSize: 20,
  };

  const output = await ListSeasoningTemplatesUseCase.execute(
    mockRepository,
    input,
  );

  expect(output.meta.totalItems).toBe(0);
  expect(output.meta.totalPages).toBe(0);
  expect(output.meta.hasNext).toBe(false);
  expect(output.meta.hasPrevious).toBe(false);
});

test("ListSeasoningTemplatesUseCase.execute: pageが総ページ数を超過しても空配列を返す", async () => {
  vi.mocked(mockRepository.findAll).mockResolvedValue({
    items: [],
    total: 2,
    page: 3,
    limit: 1,
    totalPages: 2,
  });

  const input: ListSeasoningTemplatesInput = {
    page: 3,
    pageSize: 1,
  };

  const output = await ListSeasoningTemplatesUseCase.execute(
    mockRepository,
    input,
  );

  expect(output.data).toEqual([]);
  expect(output.meta.hasNext).toBe(false);
  expect(output.meta.hasPrevious).toBe(true);
});
