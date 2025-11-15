import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { SeasoningDetailDto } from "./dto";

const formatDate = (value: Date | null): string | null => {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(0, 10);
};

export class CreateSeasoningMapper {
  static toDetailDto(
    entity: Seasoning,
    typeName: string
  ): SeasoningDetailDto {
    return {
      id: entity.id,
      name: entity.name,
      typeId: entity.typeId,
      typeName,
      imageId: entity.imageId,
      bestBeforeAt: formatDate(entity.bestBeforeAt),
      expiresAt: formatDate(entity.expiresAt),
      purchasedAt: formatDate(entity.purchasedAt),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
