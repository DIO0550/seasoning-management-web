/**
 * @fileoverview 調味料複製UseCase Mapper
 */

import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { SeasoningCreateInput } from "@/infrastructure/database/interfaces";
import type { DuplicateSeasoningInput, DuplicateSeasoningOutput } from "./dto";
import { stringToUtcDate, utcDateToString } from "@/utils/date-conversion";

export class DuplicateSeasoningMapper {
  static toCreateInput(
    original: Seasoning,
    input: DuplicateSeasoningInput
  ): SeasoningCreateInput {
    return {
      name: input.name ?? original.name,
      typeId: original.typeId,
      imageId: input.imageId !== undefined ? input.imageId : original.imageId,
      bestBeforeAt:
        input.bestBeforeAt !== undefined
          ? stringToUtcDate(input.bestBeforeAt)
          : original.bestBeforeAt,
      expiresAt:
        input.expiresAt !== undefined
          ? stringToUtcDate(input.expiresAt)
          : original.expiresAt,
      purchasedAt:
        input.purchasedAt !== undefined
          ? stringToUtcDate(input.purchasedAt)
          : original.purchasedAt,
    };
  }

  static toOutput(entity: Seasoning): DuplicateSeasoningOutput {
    return {
      id: entity.id,
      name: entity.name,
      typeId: entity.typeId,
      imageId: entity.imageId,
      bestBeforeAt: utcDateToString(entity.bestBeforeAt),
      expiresAt: utcDateToString(entity.expiresAt),
      purchasedAt: utcDateToString(entity.purchasedAt),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      expiryStatus: entity.getExpiryStatus(),
      daysUntilExpiry: entity.calculateDaysUntilExpiry(),
    };
  }
}
