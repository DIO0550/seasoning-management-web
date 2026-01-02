/**
 * @fileoverview 調味料更新UseCase Mapper
 */

import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { SeasoningUpdateInput } from "@/infrastructure/database/interfaces";
import type { UpdateSeasoningInput, UpdateSeasoningOutput } from "./dto";
import { stringToUtcDate, utcDateToString } from "@/utils/date-conversion";

export class UpdateSeasoningMapper {
  static toRepositoryInput(input: UpdateSeasoningInput): SeasoningUpdateInput {
    const result: SeasoningUpdateInput = {};

    if (input.name !== undefined) {
      Object.assign(result, { name: input.name });
    }
    if (input.typeId !== undefined) {
      Object.assign(result, { typeId: input.typeId });
    }
    if (input.imageId !== undefined) {
      Object.assign(result, { imageId: input.imageId });
    }
    if (input.bestBeforeAt !== undefined) {
      Object.assign(result, {
        bestBeforeAt: stringToUtcDate(input.bestBeforeAt),
      });
    }
    if (input.expiresAt !== undefined) {
      Object.assign(result, { expiresAt: stringToUtcDate(input.expiresAt) });
    }
    if (input.purchasedAt !== undefined) {
      Object.assign(result, {
        purchasedAt: stringToUtcDate(input.purchasedAt),
      });
    }

    return result;
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
