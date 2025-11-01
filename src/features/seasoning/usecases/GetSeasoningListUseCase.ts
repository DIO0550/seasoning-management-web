import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
} from "@/infrastructure/database/interfaces";
import type { SeasoningListItem } from "@/types/seasoning";
import { SeasoningService } from "@/features/seasoning/services/SeasoningService";
import { sortSeasoningsByExpiry } from "@/utils/seasoningSort";
import { calculateExpiryStatus } from "@/utils/expiryCalculation";

interface Dependencies {
  seasoningRepository: ISeasoningRepository;
  seasoningTypeRepository: ISeasoningTypeRepository;
}

/**
 * 調味料一覧を取得するユースケース
 * ビジネスの使用例を表現し、期限管理のビジネスロジックを含む
 * - 期限切れ状況を含む調味料リストを提供
 * - 並び順は期限が近い順
 */

interface SeasoningListSummary {
  seasonings: SeasoningListItem[];
  totalCount: number;
  expiringCount: number;
  expiredCount: number;
}

async function getSeasoningList({
  seasoningRepository,
  seasoningTypeRepository,
}: Dependencies): Promise<SeasoningListSummary> {
  const seasonings = await SeasoningService.getSeasoningList({
    seasoningRepository,
    seasoningTypeRepository,
  });
  const today = new Date();

  // reduceを使用してマッピングとカウンティングを一度のパスで実行
  const { listItems, expiringCount, expiredCount } = seasonings.reduce(
    (acc, seasoning) => {
      const expiryDate = seasoning.expiresAt || seasoning.bestBeforeAt;
      const expiryInfo = calculateExpiryStatus(expiryDate, today);

      // カウンティング
      if (expiryInfo.status === "expired") {
        acc.expiredCount++;
      } else if (expiryInfo.status === "expiring_soon") {
        acc.expiringCount++;
      }

      acc.listItems.push({
        id: seasoning.id,
        name: seasoning.name,
        typeId: seasoning.typeId,
        expiresAt: seasoning.expiresAt || undefined,
        bestBeforeAt: seasoning.bestBeforeAt || undefined,
        purchasedAt: seasoning.purchasedAt || undefined,
        daysUntilExpiry: expiryInfo.daysUntilExpiry,
        expiryStatus: expiryInfo.status,
      });

      return acc;
    },
    { listItems: [] as SeasoningListItem[], expiringCount: 0, expiredCount: 0 }
  );

  // 期限が近い順に並び替え
  listItems.sort(sortSeasoningsByExpiry);

  return {
    seasonings: listItems,
    totalCount: seasonings.length,
    expiringCount,
    expiredCount,
  };
}

export const GetSeasoningListUseCase = {
  execute: getSeasoningList,
};
