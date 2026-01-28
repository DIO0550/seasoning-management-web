import type { IUnitOfWork } from "@/domain/repositories/i-unit-of-work";
import { DuplicateError, NotFoundError } from "@/domain/errors";
import { SeasoningTypeFactory } from "@/domain/entities/seasoning-type/seasoning-type-factory";
import type {
  UpdateSeasoningTypeInput,
  UpdateSeasoningTypeOutput,
} from "@/features/seasoning-types/usecases/update-seasoning-type/dto";
import { UpdateSeasoningTypeMapper } from "@/features/seasoning-types/usecases/update-seasoning-type/mapper";

export class UpdateSeasoningTypeUseCase {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(
    input: UpdateSeasoningTypeInput,
  ): Promise<UpdateSeasoningTypeOutput> {
    const normalizedName = SeasoningTypeFactory.create(input.name);

    return this.unitOfWork.run(async (ctx) => {
      const seasoningTypeRepository = ctx.getSeasoningTypeRepository();
      const seasoningType = await seasoningTypeRepository.findById(
        input.typeId,
      );

      if (!seasoningType) {
        throw new NotFoundError("seasoning-type", input.typeId);
      }

      const isDuplicate = await seasoningTypeRepository.existsByName(
        normalizedName,
        input.typeId,
      );

      if (isDuplicate) {
        throw new DuplicateError("name", normalizedName);
      }

      const updateResult = await seasoningTypeRepository.update(input.typeId, {
        name: normalizedName,
      });

      if (updateResult.affectedRows === 0) {
        throw new NotFoundError("seasoning-type", input.typeId);
      }

      const updatedEntity = seasoningType.updateName(
        normalizedName,
        updateResult.updatedAt,
      );

      return UpdateSeasoningTypeMapper.toDetailDto(updatedEntity);
    });
  }
}
