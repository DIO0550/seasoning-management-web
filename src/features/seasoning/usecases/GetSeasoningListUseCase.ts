import type { ISeasoningRepository } from "@/libs/database/interfaces/ISeasoningRepository";
import type { ISeasoningTypeRepository } from "@/libs/database/interfaces/ISeasoningTypeRepository";
import { SeasoningService } from "@/features/seasoning/services/SeasoningService";
import { VALIDATION_CONSTANTS } from "@/constants/validation";
import { sortSeasoningsByExpiry } from "@/utils/seasoningSort";

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
/**
 * 調味料リスト項目の型定義
 */
export interface SeasoningListItem {
  id: number;
  name: string;
  typeId: number;
  expiresAt?: Date;
  bestBeforeAt?: Date;
  purchasedAt?: Date;
  daysUntilExpiry?: number;
  expiryStatus: "fresh" | "expiring_soon" | "expired" | "unknown";
}

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
      let daysUntilExpiry: number | undefined;
      let expiryStatus: SeasoningListItem["expiryStatus"] = "unknown";

      if (expiryDate) {
        const timeDiff = expiryDate.getTime() - today.getTime();
        daysUntilExpiry = Math.ceil(
          timeDiff / VALIDATION_CONSTANTS.EXPIRY.MILLISECONDS_PER_DAY
        );

        if (daysUntilExpiry < 0) {
          expiryStatus = "expired";
          acc.expiredCount++;
        } else if (
          daysUntilExpiry <= VALIDATION_CONSTANTS.EXPIRY.EXPIRY_WARNING_DAYS
        ) {
          expiryStatus = "expiring_soon";
          acc.expiringCount++;
        } else {
          expiryStatus = "fresh";
        }
      }

      acc.listItems.push({
        id: seasoning.id,
        name: seasoning.name,
        typeId: seasoning.typeId,
        expiresAt: seasoning.expiresAt || undefined,
        bestBeforeAt: seasoning.bestBeforeAt || undefined,
        purchasedAt: seasoning.purchasedAt || undefined,
        daysUntilExpiry,
        expiryStatus,
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
