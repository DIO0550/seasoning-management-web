/**
 * @fileoverview 調味料削除ユースケース
 * 調味料の削除処理を担当するアプリケーション層のユースケース
 */

import type { ISeasoningRepository } from "@/infrastructure/database/interfaces";
import { NotFoundError } from "@/domain/errors/not-found-error";
import type { DeleteSeasoningInput } from "@/features/seasonings/usecases/delete-seasoning/dto";

/**
 * 調味料削除ユースケース
 */
export class DeleteSeasoningUseCase {
  constructor(private readonly seasoningRepository: ISeasoningRepository) {}

  /**
   * 調味料を削除する
   * @param input 削除対象の調味料ID
   * @throws {NotFoundError} 調味料が存在しない場合
   */
  async execute(input: DeleteSeasoningInput): Promise<void> {
    const seasoning = await this.seasoningRepository.findById(
      input.seasoningId
    );

    if (!seasoning) {
      throw new NotFoundError("seasoning", input.seasoningId);
    }

    await this.seasoningRepository.delete(input.seasoningId);
  }
}
