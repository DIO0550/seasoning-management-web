/**
 * @fileoverview 調味料エンティティのテスト
 * TDD（Test-Driven Development）で実装
 */

import { test, expect } from "vitest";
import { Seasoning, SeasoningSchema } from "../seasoning";

test("Seasoning: 有効なデータでエンティティを生成できる", () => {
  const validSeasoningData = {
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    const seasoning = new Seasoning(validSeasoningData);
    expect(seasoning.id).toBe(1);
    expect(seasoning.name).toBe("醤油");
    expect(seasoning.typeId).toBe(1);
  }).not.toThrow();
});

test("Seasoning: name が空文字の場合は生成に失敗する", () => {
  const invalidSeasoningData = {
    id: 1,
    name: "",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    new Seasoning(invalidSeasoningData);
  }).toThrow("name cannot be empty");
});

test("SeasoningSchema: 有効なデータはバリデーションを通過する", () => {
  const validData = {
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningSchema.parse(validData);
  }).not.toThrow();
});

test("SeasoningSchema: name が文字列でない場合はバリデーションエラー", () => {
  const invalidData = {
    id: 1,
    name: 123,
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  expect(() => {
    SeasoningSchema.parse(invalidData);
  }).toThrow();
});

test("Seasoning: calculateDaysUntilExpiry() - 期限までの日数を計算できる", () => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 10);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: futureDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const days = seasoning.calculateDaysUntilExpiry();
  expect(days).toBeGreaterThanOrEqual(9);
  expect(days).toBeLessThanOrEqual(10);
});

test("Seasoning: calculateDaysUntilExpiry() - 期限がない場合はnullを返す", () => {
  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.calculateDaysUntilExpiry()).toBeNull();
});

test("Seasoning: calculateDaysUntilExpiry() - 過去の日付の場合は負の値を返す", () => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: pastDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const days = seasoning.calculateDaysUntilExpiry();
  expect(days).toBeLessThan(0);
});

test("Seasoning: getExpiryStatus() - 期限が7日以上先の場合は'fresh'", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: futureDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.getExpiryStatus()).toBe("fresh");
});

test("Seasoning: getExpiryStatus() - 期限が7日以内の場合は'expiring_soon'", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 3);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: futureDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.getExpiryStatus()).toBe("expiring_soon");
});

test("Seasoning: getExpiryStatus() - 期限切れの場合は'expired'", () => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: pastDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.getExpiryStatus()).toBe("expired");
});

test("Seasoning: getExpiryStatus() - 期限がない場合は'unknown'", () => {
  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.getExpiryStatus()).toBe("unknown");
});

test("Seasoning: isExpired() - 期限切れの場合はtrue", () => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: pastDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.isExpired()).toBe(true);
});

test("Seasoning: isExpired() - 期限切れでない場合はfalse", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: futureDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.isExpired()).toBe(false);
});

test("Seasoning: isExpiringSoon() - 期限が7日以内の場合はtrue", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 3);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: futureDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.isExpiringSoon()).toBe(true);
});

test("Seasoning: isExpiringSoon() - 期限が7日以上先の場合はfalse", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);

  const seasoning = new Seasoning({
    id: 1,
    name: "醤油",
    typeId: 1,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: futureDate,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  expect(seasoning.isExpiringSoon()).toBe(false);
});
