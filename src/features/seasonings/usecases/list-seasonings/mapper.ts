/**
 * @fileoverview ListSeasoningsMapper - Domain Entity ↔ DTO変換
 */

import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { SeasoningListItemDto } from "./dto";

/**
 * ListSeasoningsのMapper
 */
export class ListSeasoningsMapper {
  /**
   * Seasoning EntityをSeasoningListItemDtoに変換
   * @param entity Seasoning Entity
   * @returns SeasoningListItemDto
   */
  static toSeasoningListItemDto(entity: Seasoning): SeasoningListItemDto {
    return {
      id: entity.id,
      name: entity.name,
      typeId: entity.typeId,
      imageId: entity.imageId,
      bestBeforeAt: entity.bestBeforeAt?.toISOString() ?? null,
      expiresAt: entity.expiresAt?.toISOString() ?? null,
      purchasedAt: entity.purchasedAt?.toISOString() ?? null,
      daysUntilExpiry: entity.calculateDaysUntilExpiry(),
      expiryStatus: entity.getExpiryStatus(),
    };
  }
}
