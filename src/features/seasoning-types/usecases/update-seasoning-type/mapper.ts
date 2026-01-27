import type { SeasoningType } from "@/libs/database/entities/seasoning-type";
import type { UpdateSeasoningTypeOutput } from "@/features/seasoning-types/usecases/update-seasoning-type/dto";

export const UpdateSeasoningTypeMapper = {
  toDetailDto: (entity: SeasoningType): UpdateSeasoningTypeOutput => ({
    id: entity.id,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }),
} as const;
