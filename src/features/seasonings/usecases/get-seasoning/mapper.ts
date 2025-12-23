import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { GetSeasoningOutput } from "@/features/seasonings/usecases/get-seasoning/dto";
import { utcDateToString } from "@/utils/date-conversion";

export class GetSeasoningMapper {
  static toOutput(entity: Seasoning): GetSeasoningOutput {
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
