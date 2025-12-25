import type { IUnitOfWork } from "@/domain/repositories/i-unit-of-work";
import { DuplicateError } from "@/domain/errors";
import { SeasoningTypeFactory } from "@/domain/entities/seasoning-type/seasoning-type-factory";
import type { CreateSeasoningTypeInput, SeasoningTypeDetailDto } from "@/features/seasoning-types/usecases/create-seasoning-type/dto";
import { CreateSeasoningTypeMapper } from "@/features/seasoning-types/usecases/create-seasoning-type/mapper";

export class CreateSeasoningTypeUseCase {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(input: CreateSeasoningTypeInput): Promise<SeasoningTypeDetailDto> {
    const normalizedName = SeasoningTypeFactory.create(input.name);

    return this.unitOfWork.run(async (ctx) => {
      const seasoningTypeRepository = ctx.getSeasoningTypeRepository();
      const isDuplicate =
        await seasoningTypeRepository.existsByName(normalizedName);

      if (isDuplicate) {
        throw new DuplicateError("name", normalizedName);
      }

      const created = await seasoningTypeRepository.create({
        name: normalizedName,
      });
      return CreateSeasoningTypeMapper.toDetailDto({
        id: created.id,
        name: normalizedName,
        createdAt: created.createdAt,
        updatedAt: created.createdAt,
      });
    });
  }
}
