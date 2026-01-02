import type { SeasoningTypeDetailDto } from "@/features/seasoning-types/usecases/create-seasoning-type/dto";

type SeasoningTypeSource = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export const CreateSeasoningTypeMapper = {
  toDetailDto: (entity: SeasoningTypeSource): SeasoningTypeDetailDto => ({
    id: entity.id,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }),
} as const;
