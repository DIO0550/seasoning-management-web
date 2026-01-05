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

    const validationPromises: Promise<void>[] = [];

    if (input.typeId !== undefined) {
      const typeId = input.typeId;
      validationPromises.push(
        this.seasoningTypeRepository.findById(typeId).then((result) => {
          if (!result) {
            throw new NotFoundError("seasoning-type", typeId);
          }
        })
      );
    }

    if (input.imageId !== undefined && input.imageId !== null) {
      const imageId = input.imageId;
      validationPromises.push(
        this.seasoningImageRepository.findById(imageId).then((result) => {
          if (!result) {
            throw new NotFoundError("seasoning-image", imageId);
          }
        })
      );
    }

    await Promise.all(validationPromises);

    const repositoryInput = UpdateSeasoningMapper.toRepositoryInput(input);
    if (Object.keys(repositoryInput).length === 0) {
      return UpdateSeasoningMapper.toOutput(existingSeasoning);
    }

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
