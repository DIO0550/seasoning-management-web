import type { SeasoningType } from "@/libs/database/entities/seasoning-type";
import type { SeasoningTypeDetailDto } from "@/features/seasoning-types/usecases/create-seasoning-type/dto";

export const CreateSeasoningTypeMapper = {
  toDetailDto: (entity: SeasoningType): SeasoningTypeDetailDto => ({
    id: entity.id,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }),
} as const;
