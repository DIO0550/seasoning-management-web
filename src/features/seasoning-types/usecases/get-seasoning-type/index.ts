import type { ISeasoningTypeRepository } from "@/infrastructure/database/interfaces";
import { NotFoundError } from "@/domain/errors";
import type {
  GetSeasoningTypeInput,
  GetSeasoningTypeOutput,
} from "@/features/seasoning-types/usecases/get-seasoning-type/dto";
import { GetSeasoningTypeMapper } from "@/features/seasoning-types/usecases/get-seasoning-type/mapper";

export class GetSeasoningTypeUseCase {
  constructor(
    private readonly seasoningTypeRepository: ISeasoningTypeRepository,
  ) {}

  async execute(input: GetSeasoningTypeInput): Promise<GetSeasoningTypeOutput> {
    const seasoningType = await this.seasoningTypeRepository.findById(
      input.typeId,
    );

    if (!seasoningType) {
      throw new NotFoundError("seasoning-type", input.typeId);
    }

    return GetSeasoningTypeMapper.toDetailDto(seasoningType);
  }
}
