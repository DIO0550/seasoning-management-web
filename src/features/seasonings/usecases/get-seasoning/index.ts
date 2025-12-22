import type { ISeasoningRepository } from "@/libs/database/interfaces/repositories/i-seasoning-repository";
import { NotFoundError } from "@/domain/errors/not-found-error";
import type { GetSeasoningInput, GetSeasoningOutput } from "@/features/seasonings/usecases/get-seasoning/dto";
import { GetSeasoningMapper } from "@/features/seasonings/usecases/get-seasoning/mapper";

export class GetSeasoningUseCase {
  constructor(private readonly seasoningRepository: ISeasoningRepository) {}

  async execute(input: GetSeasoningInput): Promise<GetSeasoningOutput> {
    const seasoning = await this.seasoningRepository.findById(
      input.seasoningId
    );

    if (!seasoning) {
      throw new NotFoundError("Seasoning", input.seasoningId);
    }

    return GetSeasoningMapper.toOutput(seasoning);
  }
}
