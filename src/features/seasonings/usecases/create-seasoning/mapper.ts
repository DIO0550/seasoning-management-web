import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import type { SeasoningDetailDto } from "./dto";

const formatDate = (value: Date | null): string | null => {
  if (!value) {
    return null;
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export class CreateSeasoningMapper {
  static toDetailDto(entity: Seasoning, typeName: string): SeasoningDetailDto {
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
