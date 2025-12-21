import type { ISeasoningRepository } from "@/libs/database/interfaces/repositories/i-seasoning-repository";
import { NotFoundError } from "@/domain/errors/not-found-error";
import type { GetSeasoningInput, GetSeasoningOutput } from "./dto";
import { GetSeasoningMapper } from "./mapper";

/**
 * 調味料詳細取得ユースケース
 */
export class GetSeasoningUseCase {
  constructor(private readonly seasoningRepository: ISeasoningRepository) {}

  /**
   * 調味料詳細を取得する
   * @param input 入力データ
   * @returns 調味料詳細
   * @throws {NotFoundError} 調味料が存在しない場合
   */
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
