import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import { DuplicateError, NotFoundError } from "@/domain/errors";
import type { CreateSeasoningInput, SeasoningDetailDto } from "./dto";
import { CreateSeasoningMapper } from "./mapper";

const toDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  return new Date(value);
};

export class CreateSeasoningUseCase {
  constructor(
    private readonly seasoningRepository: ISeasoningRepository,
    private readonly seasoningTypeRepository: ISeasoningTypeRepository,
    private readonly seasoningImageRepository: ISeasoningImageRepository
  ) {}

  async execute(input: CreateSeasoningInput): Promise<SeasoningDetailDto> {
    const name = input.name.trim();

    const duplicates = await this.seasoningRepository.findByName(name);
    if (duplicates.some((seasoning) => seasoning.name === name)) {
      throw new DuplicateError("name", name);
    }

    const seasoningType = await this.seasoningTypeRepository.findById(
      input.typeId
    );

    if (!seasoningType) {
      throw new NotFoundError("SeasoningType", input.typeId);
    }

    if (typeof input.imageId === "number") {
      const image = await this.seasoningImageRepository.findById(
        input.imageId
      );

      if (!image) {
        throw new NotFoundError("SeasoningImage", input.imageId);
      }
    }

    const created = await this.seasoningRepository.create({
      name,
      typeId: input.typeId,
      imageId:
        typeof input.imageId === "number" ? input.imageId : null,
      bestBeforeAt: toDate(input.bestBeforeAt),
      expiresAt: toDate(input.expiresAt),
      purchasedAt: toDate(input.purchasedAt),
    });

    return CreateSeasoningMapper.toDetailDto(created, seasoningType.name);
  }
}
