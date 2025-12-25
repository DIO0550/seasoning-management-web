/**
 * @fileoverview ListSeasoningsMapperのテスト
 */

import { test, expect } from "vitest";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { ListSeasoningsMapper } from "@/features/seasonings/usecases/list-seasonings/mapper";

test("ListSeasoningsMapper.toSeasoningListItemDto: Seasoning EntityをSeasoningListItemDtoに変換する", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 2,
    imageId: 3,
    bestBeforeAt: null,
    expiresAt: futureDate,
    purchasedAt: new Date("2025-01-01"),
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-02T00:00:00Z"),
  });

  const dto = ListSeasoningsMapper.toSeasoningListItemDto(seasoning);

  expect(dto.id).toBe(1);
  expect(dto.name).toBe("醤油");
  expect(dto.typeId).toBe(2);
  expect(dto.imageId).toBe(3);
  expect(dto.bestBeforeAt).toBeNull();
  expect(dto.expiresAt).toBe(futureDate.toISOString());
  expect(dto.purchasedAt).toBe("2025-01-01T00:00:00.000Z");
  expect(dto.daysUntilExpiry).toBeTypeOf("number");
  expect(dto.expiryStatus).toBe("fresh");
});

test("ListSeasoningsMapper.toSeasoningListItemDto: null値を持つSeasoning Entityを正しく変換する", () => {
  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 2,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-02T00:00:00Z"),
  });

  const dto = ListSeasoningsMapper.toSeasoningListItemDto(seasoning);

  expect(dto.id).toBe(1);
  expect(dto.name).toBe("醤油");
  expect(dto.typeId).toBe(2);
  expect(dto.imageId).toBeNull();
  expect(dto.bestBeforeAt).toBeNull();
  expect(dto.expiresAt).toBeNull();
  expect(dto.purchasedAt).toBeNull();
  expect(dto.daysUntilExpiry).toBeNull();
  expect(dto.expiryStatus).toBe("unknown");
});

test("ListSeasoningsMapper.toSeasoningListItemDto: 期限切れの調味料を正しく変換する", () => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);

  const seasoning = new Seasoning({
    id: 1,
    name: "古い醤油",
    typeId: 2,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: pastDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const dto = ListSeasoningsMapper.toSeasoningListItemDto(seasoning);

  expect(dto.expiryStatus).toBe("expired");
  expect(dto.daysUntilExpiry).toBeLessThan(0);
});
