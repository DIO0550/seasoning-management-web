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

    // 重複チェック（名前が同じものがないかチェック）
    const duplicates = await this.seasoningRepository.findByName(name);
    if (duplicates.length > 0) {
      throw new DuplicateError("name", name);
    }

    // 調味料種類の存在確認
    const seasoningType = await this.seasoningTypeRepository.findById(
      input.typeId
    );

    if (!seasoningType) {
      throw new NotFoundError("SeasoningType", input.typeId);
    }

    // 画像IDの存在確認（指定された場合のみ）
    const imageId = typeof input.imageId === "number" ? input.imageId : null;
    if (imageId !== null) {
      const image = await this.seasoningImageRepository.findById(imageId);
      if (!image) {
        throw new NotFoundError("SeasoningImage", imageId);
      }
    }

    const created = await this.seasoningRepository.create({
      name,
      typeId: input.typeId,
      imageId,
      bestBeforeAt: toDate(input.bestBeforeAt),
      expiresAt: toDate(input.expiresAt),
      purchasedAt: toDate(input.purchasedAt),
    });

    return CreateSeasoningMapper.toDetailDto(created, seasoningType.name);
  }
}
