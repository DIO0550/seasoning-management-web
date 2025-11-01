import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import { SeasoningService } from "@/features/seasoning/services/SeasoningService";
import type { Seasoning } from "@/libs/database/entities/Seasoning";

interface Dependencies {
  seasoningRepository: ISeasoningRepository;
  seasoningTypeRepository: ISeasoningTypeRepository;
}

/**
 * 新しい調味料をシステムに追加するユースケース
 * ビジネスの使用例を表現し、入力形式に依存しない純粋なビジネスロジック
 */
async function addNewSeasoning(
  name: string,
  typeId: number,
  imageId: number | undefined,
  { seasoningRepository, seasoningTypeRepository }: Dependencies
): Promise<Seasoning> {
  // ビジネスロジックはService層に委ねる
  return await SeasoningService.addNewSeasoning(
    {
      name,
      typeId,
      imageId,
    },
    {
      seasoningRepository,
      seasoningTypeRepository,
    }
  );
}

export const AddNewSeasoningUseCase = {
  execute: addNewSeasoning,
};
