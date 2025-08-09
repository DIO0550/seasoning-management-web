import type { ISeasoningRepository } from "@/libs/database/interfaces/ISeasoningRepository";
import type { ISeasoningTypeRepository } from "@/libs/database/interfaces/ISeasoningTypeRepository";
import { SeasoningService } from "@/features/seasoning/services/SeasoningService";
import { VALIDATION_CONSTANTS } from "@/constants/validation";

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
interface SeasoningListItem {
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
  let expiringCount = 0;
  let expiredCount = 0;

  const listItems: SeasoningListItem[] = seasonings.map((seasoning) => {
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
        expiredCount++;
      } else if (
        daysUntilExpiry <= VALIDATION_CONSTANTS.EXPIRY.EXPIRY_WARNING_DAYS
      ) {
        expiryStatus = "expiring_soon";
        expiringCount++;
      } else {
        expiryStatus = "fresh";
      }
    }

    return {
      id: seasoning.id,
      name: seasoning.name,
      typeId: seasoning.typeId,
      expiresAt: seasoning.expiresAt || undefined,
      bestBeforeAt: seasoning.bestBeforeAt || undefined,
      purchasedAt: seasoning.purchasedAt || undefined,
      daysUntilExpiry,
      expiryStatus,
    };
  });

  // 期限が近い順に並び替え
  listItems.sort((a, b) => {
    // 期限切れのものを最初に
    if (a.expiryStatus === "expired" && b.expiryStatus !== "expired") return -1;
    if (a.expiryStatus !== "expired" && b.expiryStatus === "expired") return 1;

    // 期限が近いものを次に
    if (a.expiryStatus === "expiring_soon" && b.expiryStatus === "fresh")
      return -1;
    if (a.expiryStatus === "fresh" && b.expiryStatus === "expiring_soon")
      return 1;

    // 同じステータス内では期限が近い順
    if (a.daysUntilExpiry !== undefined && b.daysUntilExpiry !== undefined) {
      return a.daysUntilExpiry - b.daysUntilExpiry;
    }

    // 期限不明のものは最後
    if (a.daysUntilExpiry === undefined && b.daysUntilExpiry !== undefined)
      return 1;
    if (a.daysUntilExpiry !== undefined && b.daysUntilExpiry === undefined)
      return -1;

    return 0;
  });

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
