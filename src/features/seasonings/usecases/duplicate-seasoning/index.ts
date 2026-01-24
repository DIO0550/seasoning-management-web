/**
 * @fileoverview 調味料複製UseCase
 * 既存の調味料を複製して新規登録する
 */

import type {
  ISeasoningRepository,
  ISeasoningImageRepository,
} from "@/infrastructure/database/interfaces";
import { DuplicateError, NotFoundError } from "@/domain/errors";
import type { DuplicateSeasoningInput, DuplicateSeasoningOutput } from "./dto";
import { DuplicateSeasoningMapper } from "./mapper";

export class DuplicateSeasoningUseCase {
  constructor(
    private readonly seasoningRepository: ISeasoningRepository,
    private readonly seasoningImageRepository: ISeasoningImageRepository
  ) {}

  async execute(
    input: DuplicateSeasoningInput
  ): Promise<DuplicateSeasoningOutput> {
    const original = await this.seasoningRepository.findById(input.seasoningId);
    if (!original) {
      throw new NotFoundError("seasoning", input.seasoningId);
    }

    const targetName = input.name ?? original.name;
    const duplicates = await this.seasoningRepository.findByName(targetName);

    if (duplicates.length > 0) {
      throw new DuplicateError("name", targetName);
    }

    if (input.imageId !== undefined && input.imageId !== null) {
      const image = await this.seasoningImageRepository.findById(input.imageId);
      if (!image) {
        throw new NotFoundError("seasoning-image", input.imageId);
      }
    }

    const createInput = DuplicateSeasoningMapper.toCreateInput(original, input);
    const created = await this.seasoningRepository.create(createInput);

    return DuplicateSeasoningMapper.toOutput(created);
  }
}
