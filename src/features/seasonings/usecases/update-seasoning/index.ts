/**
 * @fileoverview 調味料更新UseCase
 */

import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import { NotFoundError } from "@/domain/errors";
import type { UpdateSeasoningInput, UpdateSeasoningOutput } from "./dto";
import { UpdateSeasoningMapper } from "./mapper";

export class UpdateSeasoningUseCase {
  constructor(
    private readonly seasoningRepository: ISeasoningRepository,
    private readonly seasoningTypeRepository: ISeasoningTypeRepository,
    private readonly seasoningImageRepository: ISeasoningImageRepository
  ) {}

  async execute(input: UpdateSeasoningInput): Promise<UpdateSeasoningOutput> {
    const existingSeasoning = await this.seasoningRepository.findById(
      input.seasoningId
    );
    if (!existingSeasoning) {
      throw new NotFoundError("seasoning", input.seasoningId);
    }

    if (input.typeId !== undefined) {
      const seasoningType = await this.seasoningTypeRepository.findById(
        input.typeId
      );
      if (!seasoningType) {
        throw new NotFoundError("seasoning-type", input.typeId);
      }
    }

    if (input.imageId !== undefined && input.imageId !== null) {
      const seasoningImage = await this.seasoningImageRepository.findById(
        input.imageId
      );
      if (!seasoningImage) {
        throw new NotFoundError("seasoning-image", input.imageId);
      }
    }

    const repositoryInput = UpdateSeasoningMapper.toRepositoryInput(input);
    await this.seasoningRepository.update(input.seasoningId, repositoryInput);

    const updatedSeasoning = await this.seasoningRepository.findById(
      input.seasoningId
    );
    if (!updatedSeasoning) {
      throw new NotFoundError("seasoning", input.seasoningId);
    }

    return UpdateSeasoningMapper.toOutput(updatedSeasoning);
  }
}

export type { UpdateSeasoningInput, UpdateSeasoningOutput } from "./dto";
