/**
 * @fileoverview GetSeasoningMapperのテスト
 */

import { expect, test } from "vitest";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { GetSeasoningMapper } from "@/features/seasonings/usecases/get-seasoning/mapper";

test("GetSeasoningMapper.toOutput: 日付フィールドをYYYY-MM-DD形式で返す", () => {
  const createdAt = new Date("2025-01-01T00:00:00.000Z");
  const updatedAt = new Date("2025-01-02T00:00:00.000Z");

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 2,
    imageId: 3,
    bestBeforeAt: new Date("2099-12-31T00:00:00.000Z"),
    expiresAt: new Date("2100-01-15T00:00:00.000Z"),
    purchasedAt: new Date("2099-01-01T00:00:00.000Z"),
    createdAt,
    updatedAt,
  });

  const dto = GetSeasoningMapper.toOutput(seasoning);

  expect(dto.bestBeforeAt).toBe("2099-12-31");
  expect(dto.expiresAt).toBe("2100-01-15");
  expect(dto.purchasedAt).toBe("2099-01-01");
  expect(dto.createdAt).toBe(createdAt.toISOString());
  expect(dto.updatedAt).toBe(updatedAt.toISOString());
  expect(dto.daysUntilExpiry).toBeTypeOf("number");
  expect(dto.daysUntilExpiry).toBeGreaterThan(7);
  expect(dto.expiryStatus).toBe("fresh");
});

test("GetSeasoningMapper.toOutput: null値を正しく変換する", () => {
  const createdAt = new Date("2025-01-01T00:00:00.000Z");
  const updatedAt = new Date("2025-01-02T00:00:00.000Z");

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 2,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt,
    updatedAt,
  });

  const dto = GetSeasoningMapper.toOutput(seasoning);

  expect(dto.imageId).toBeNull();
  expect(dto.bestBeforeAt).toBeNull();
  expect(dto.expiresAt).toBeNull();
  expect(dto.purchasedAt).toBeNull();
  expect(dto.daysUntilExpiry).toBeNull();
  expect(dto.expiryStatus).toBe("unknown");
});

