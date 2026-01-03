/**
 * @fileoverview 調味料更新UseCase
 */

import type { ISeasoningRepository } from "@/infrastructure/database/interfaces";
import { NotFoundError } from "@/domain/errors";
import type { UpdateSeasoningInput, UpdateSeasoningOutput } from "./dto";
import { UpdateSeasoningMapper } from "./mapper";

export class UpdateSeasoningUseCase {
  constructor(private readonly seasoningRepository: ISeasoningRepository) {}

  async execute(input: UpdateSeasoningInput): Promise<UpdateSeasoningOutput> {
    const existingSeasoning = await this.seasoningRepository.findById(
      input.seasoningId
    );
    if (!existingSeasoning) {
      throw new NotFoundError("seasoning", input.seasoningId);
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
