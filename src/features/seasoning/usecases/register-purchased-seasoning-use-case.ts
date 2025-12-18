import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import { SeasoningService } from "@/features/seasoning/services/seasoning-service";
import type { Seasoning } from "@/libs/database/entities/seasoning";

interface Dependencies {
  seasoningRepository: ISeasoningRepository;
  seasoningTypeRepository: ISeasoningTypeRepository;
}

/**
 * 購入した調味料をシステムに登録するユースケース
 * ビジネスの使用例を表現し、入力形式に依存しない純粋なビジネスロジック
 */
async function registerPurchasedSeasoning(
  name: string,
  typeId: number,
  purchasedAt: Date,
  expiresAt: Date | undefined,
  bestBeforeAt: Date | undefined,
  imageId: number | undefined,
  { seasoningRepository, seasoningTypeRepository }: Dependencies
): Promise<Seasoning> {
  // ビジネスロジックはService層に委ねる
  return await SeasoningService.registerPurchasedSeasoning(
    {
      name,
      typeId,
      purchasedAt,
      expiresAt,
      bestBeforeAt,
      imageId,
    },
    {
      seasoningRepository,
      seasoningTypeRepository,
    }
  );
}
export const RegisterPurchasedSeasoningUseCase = {
  execute: registerPurchasedSeasoning,
};
