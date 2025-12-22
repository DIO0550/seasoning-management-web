import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { GetSeasoningOutput } from "@/features/seasonings/usecases/get-seasoning/dto";

export class GetSeasoningMapper {
  static toOutput(entity: Seasoning): GetSeasoningOutput {
    return {
      id: entity.id,
      name: entity.name,
      typeId: entity.typeId,
      imageId: entity.imageId,
      bestBeforeAt: entity.bestBeforeAt?.toISOString() ?? null,
      expiresAt: entity.expiresAt?.toISOString() ?? null,
      purchasedAt: entity.purchasedAt?.toISOString() ?? null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      expiryStatus: entity.getExpiryStatus(),
      daysUntilExpiry: entity.calculateDaysUntilExpiry(),
    };
  }
}
