import type { IUnitOfWork } from "@/domain/repositories/i-unit-of-work";
import { DuplicateError, SeasoningTypeCreateError } from "@/domain/errors";
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
      const seasoningType = await seasoningTypeRepository.findById(created.id);

      if (!seasoningType) {
        throw new SeasoningTypeCreateError(
          "作成した調味料の種類が取得できませんでした"
        );
      }

      return CreateSeasoningTypeMapper.toDetailDto(seasoningType);
    });
  }
}
