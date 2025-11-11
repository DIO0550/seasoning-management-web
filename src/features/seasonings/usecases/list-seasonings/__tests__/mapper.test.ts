/**
 * @fileoverview ListSeasoningsMapperのテスト
 */

import { describe, it, expect } from "vitest";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { ListSeasoningsMapper } from "../mapper";

describe("ListSeasoningsMapper", () => {
  describe("toSeasoningListItemDto", () => {
    it("Seasoning EntityをSeasoningListItemDtoに変換する", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);

      const seasoning = new Seasoning({
        id: 1,
        name: "醤油",
        typeId: 2,
        imageId: 3,
        bestBeforeAt: new Date("2025-12-31"),
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
      expect(dto.bestBeforeAt).toBe("2025-12-31T00:00:00.000Z");
      expect(dto.expiresAt).toBe(futureDate.toISOString());
      expect(dto.purchasedAt).toBe("2025-01-01T00:00:00.000Z");
      expect(dto.daysUntilExpiry).toBeTypeOf("number");
      expect(dto.expiryStatus).toBe("fresh");
    });

    it("null値を持つSeasoning Entityを正しく変換する", () => {
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

    it("期限切れの調味料を正しく変換する", () => {
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
  });
});
