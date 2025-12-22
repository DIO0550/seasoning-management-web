import { expect, test } from "vitest";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { GetSeasoningMapper } from "@/features/seasonings/usecases/get-seasoning/mapper";

test("GetSeasoningMapper.toOutput: 日付をISO文字列に変換して返す", () => {
  const bestBeforeAt = new Date("2025-12-31T00:00:00.000Z");
  const expiresAt = new Date("2026-01-31T00:00:00.000Z");
  const purchasedAt = new Date("2025-01-01T00:00:00.000Z");
  const createdAt = new Date("2025-01-01T00:00:00.000Z");
  const updatedAt = new Date("2025-01-02T00:00:00.000Z");

  const entity = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt,
    expiresAt,
    purchasedAt,
    createdAt,
    updatedAt,
  });

  expect(GetSeasoningMapper.toOutput(entity)).toEqual({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: 10,
    bestBeforeAt: bestBeforeAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    purchasedAt: purchasedAt.toISOString(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    expiryStatus: expect.any(String),
    daysUntilExpiry: expect.any(Number),
  });
});

test("GetSeasoningMapper.toOutput: 期限日がnullの場合はunknown/nullを返す", () => {
  const createdAt = new Date("2025-01-01T00:00:00.000Z");
  const updatedAt = new Date("2025-01-02T00:00:00.000Z");

  const entity = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt,
    updatedAt,
  });

  expect(GetSeasoningMapper.toOutput(entity)).toEqual({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    expiryStatus: "unknown",
    daysUntilExpiry: null,
  });
});

