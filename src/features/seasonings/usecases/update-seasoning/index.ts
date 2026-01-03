/**
 * @fileoverview 調味料更新UseCase
 */

import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import { NotFoundError } from "@/domain/errors";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
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
    if (Object.keys(repositoryInput).length === 0) {
      return UpdateSeasoningMapper.toOutput(existingSeasoning);
    }

    const updateResult = await this.seasoningRepository.update(
      input.seasoningId,
      repositoryInput
    );
    if (updateResult.affectedRows === 0) {
      throw new NotFoundError("seasoning", input.seasoningId);
    }

    const updatedSeasoning = new Seasoning({
      id: existingSeasoning.id,
      name:
        repositoryInput.name !== undefined
          ? repositoryInput.name
          : existingSeasoning.name,
      typeId:
        repositoryInput.typeId !== undefined
          ? repositoryInput.typeId
          : existingSeasoning.typeId,
      imageId:
        repositoryInput.imageId !== undefined
          ? repositoryInput.imageId
          : existingSeasoning.imageId,
      bestBeforeAt:
        repositoryInput.bestBeforeAt !== undefined
          ? repositoryInput.bestBeforeAt
          : existingSeasoning.bestBeforeAt,
      expiresAt:
        repositoryInput.expiresAt !== undefined
          ? repositoryInput.expiresAt
          : existingSeasoning.expiresAt,
      purchasedAt:
        repositoryInput.purchasedAt !== undefined
          ? repositoryInput.purchasedAt
          : existingSeasoning.purchasedAt,
      createdAt: existingSeasoning.createdAt,
      updatedAt: updateResult.updatedAt,
    });

    return UpdateSeasoningMapper.toOutput(updatedSeasoning);
  }
}

export type { UpdateSeasoningInput, UpdateSeasoningOutput } from "./dto";
