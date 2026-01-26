import type { SeasoningType } from "@/libs/database/entities/seasoning-type";
import type { GetSeasoningTypeOutput } from "@/features/seasoning-types/usecases/get-seasoning-type/dto";

export const GetSeasoningTypeMapper = {
  toDetailDto: (entity: SeasoningType): GetSeasoningTypeOutput => ({
    id: entity.id,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }),
} as const;
