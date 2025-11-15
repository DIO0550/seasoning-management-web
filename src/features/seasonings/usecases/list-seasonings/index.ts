/**
 * @fileoverview ListSeasoningsUseCase - 調味料一覧取得UseCase
 */

import type { ISeasoningRepository } from "@/infrastructure/database/interfaces";
import type {
  ListSeasoningsInput,
  ListSeasoningsOutput,
  PaginationMeta,
  SeasoningSummary,
} from "./dto";
import { ListSeasoningsMapper } from "./mapper";

/**
 * 調味料一覧取得UseCase
 */
export class ListSeasoningsUseCase {
  constructor(private readonly seasoningRepository: ISeasoningRepository) {}

  /**
   * 調味料一覧を取得する
   * @param input クエリパラメータ
   * @returns 調味料一覧とメタ情報
   */
  async execute(input: ListSeasoningsInput): Promise<ListSeasoningsOutput> {
    // 1. リポジトリからDomain Entityを取得
    const result = await this.seasoningRepository.findAll({
      search: input.search,
      typeId: input.typeId,
      pagination: {
        page: input.page,
        limit: input.pageSize,
      },
    });

    // 2. サマリー計算（全データから）
    const statistics = await this.seasoningRepository.getStatistics({
      search: input.search,
      typeId: input.typeId,
    });

    const summary: SeasoningSummary = {
      totalCount: statistics.total,
      expiringCount: statistics.expiringSoon,
      expiredCount: statistics.expired,
    };

    // 3. Domain Entity → Output DTOに変換
    const data = result.items.map((s) =>
      ListSeasoningsMapper.toSeasoningListItemDto(s)
    );

    // 4. ページネーションメタ情報
    const meta: PaginationMeta = {
      page: result.page,
      pageSize: result.limit,
      totalItems: result.total,
      totalPages: result.totalPages,
      hasNext: result.page < result.totalPages,
      hasPrevious: result.page > 1,
    };

    return {
      data,
      meta,
      summary,
    };
  }
}
