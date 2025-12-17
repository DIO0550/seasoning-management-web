import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import { DuplicateError, NotFoundError } from "@/domain/errors";
import type { CreateSeasoningInput, SeasoningDetailDto } from "./dto";
import { CreateSeasoningMapper } from "./mapper";
import { stringToUtcDate } from "@/utils/date-conversion";

export class CreateSeasoningUseCase {
  constructor(
    private readonly seasoningRepository: ISeasoningRepository,
    private readonly seasoningTypeRepository: ISeasoningTypeRepository,
    private readonly seasoningImageRepository: ISeasoningImageRepository
  ) {}

  async execute(input: CreateSeasoningInput): Promise<SeasoningDetailDto> {
    // 重複チェック: 同名の調味料が既に存在する場合はエラー
    const duplicates = await this.seasoningRepository.findByName(input.name);
    if (duplicates.length > 0) {
      throw new DuplicateError("name", input.name);
    }

    // 調味料種類・画像IDの存在確認を並列実行
    const imageId = typeof input.imageId === "number" ? input.imageId : null;
    const [seasoningType, image] = await Promise.all([
      this.seasoningTypeRepository.findById(input.typeId),
      imageId !== null
        ? this.seasoningImageRepository.findById(imageId)
        : Promise.resolve(null),
    ]);

    if (!seasoningType) {
      throw new NotFoundError("seasoning-type", input.typeId);
    }

    if (imageId !== null && !image) {
      throw new NotFoundError("seasoning-image", imageId);
    }

    const created = await this.seasoningRepository.create({
      name: input.name,
      typeId: input.typeId,
      imageId,
      bestBeforeAt: stringToUtcDate(input.bestBeforeAt),
      expiresAt: stringToUtcDate(input.expiresAt),
      purchasedAt: stringToUtcDate(input.purchasedAt),
    });

    return CreateSeasoningMapper.toDetailDto(created, seasoningType.name);
  }
}
