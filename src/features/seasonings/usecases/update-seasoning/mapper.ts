/**
 * @fileoverview 調味料更新UseCase Mapper
 */

import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { SeasoningUpdateInput } from "@/infrastructure/database/interfaces";
import type { UpdateSeasoningInput, UpdateSeasoningOutput } from "./dto";
import { stringToUtcDate, utcDateToString } from "@/utils/date-conversion";

export class UpdateSeasoningMapper {
  static toRepositoryInput(input: UpdateSeasoningInput): SeasoningUpdateInput {
    return {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.typeId !== undefined ? { typeId: input.typeId } : {}),
      ...(input.imageId !== undefined ? { imageId: input.imageId } : {}),
      ...(input.bestBeforeAt !== undefined
        ? { bestBeforeAt: stringToUtcDate(input.bestBeforeAt) }
        : {}),
      ...(input.expiresAt !== undefined
        ? { expiresAt: stringToUtcDate(input.expiresAt) }
        : {}),
      ...(input.purchasedAt !== undefined
        ? { purchasedAt: stringToUtcDate(input.purchasedAt) }
        : {}),
    };
  }

  static toOutput(entity: Seasoning): UpdateSeasoningOutput {
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
