import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { SeasoningDetailDto } from "./dto";
import { utcDateToString } from "@/utils/date-conversion";

export class CreateSeasoningMapper {
  static toDetailDto(entity: Seasoning, typeName: string): SeasoningDetailDto {
    return {
      id: entity.id,
      name: entity.name,
      typeId: entity.typeId,
      typeName,
      imageId: entity.imageId,
      bestBeforeAt: utcDateToString(entity.bestBeforeAt),
      expiresAt: utcDateToString(entity.expiresAt),
      purchasedAt: utcDateToString(entity.purchasedAt),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
