import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import { NotFoundError } from "@/domain/errors";
import { stringToUtcDate } from "@/utils/date-conversion";
import type { PurchasedSeasoningDetailDto, RegisterPurchaseInput } from "./dto";
import { RegisterPurchaseMapper } from "./mapper";

export class RegisterPurchaseUseCase {
  constructor(
    private readonly seasoningRepository: ISeasoningRepository,
    private readonly seasoningTypeRepository: ISeasoningTypeRepository,
    private readonly seasoningImageRepository: ISeasoningImageRepository
  ) {}

  async execute(
    input: RegisterPurchaseInput
  ): Promise<PurchasedSeasoningDetailDto> {
    const imageId = typeof input.imageId === "number" ? input.imageId : null;

    const [seasoningType, image] = await Promise.all([
      this.seasoningTypeRepository.findById(input.typeId),
      imageId !== null
        ? this.seasoningImageRepository.findById(imageId)
        : Promise.resolve(null),
    ]);

    if (!seasoningType) {
      throw new NotFoundError("SeasoningType", input.typeId);
    }

    if (imageId !== null && !image) {
      throw new NotFoundError("SeasoningImage", imageId);
    }

    const created = await this.seasoningRepository.create({
      name: input.name,
      typeId: input.typeId,
      imageId,
      bestBeforeAt: stringToUtcDate(input.bestBeforeAt),
      expiresAt: stringToUtcDate(input.expiresAt),
      purchasedAt: stringToUtcDate(input.purchasedAt),
    });

    return RegisterPurchaseMapper.toDetailDto(created, seasoningType.name);
  }
}
