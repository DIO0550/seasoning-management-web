/**
 * @fileoverview ListSeasoningTemplatesUseCase - 調味料テンプレート一覧取得UseCase
 */

import type { ISeasoningTemplateRepository } from "@/infrastructure/database/interfaces";
import type {
  ListSeasoningTemplatesInput,
  ListSeasoningTemplatesOutput,
  PaginationMeta,
} from "@/features/seasoning-templates/usecases/list-seasoning-templates/dto";
import { ListSeasoningTemplatesMapper } from "@/features/seasoning-templates/usecases/list-seasoning-templates/mapper";

export class ListSeasoningTemplatesUseCase {
  constructor(private readonly repository: ISeasoningTemplateRepository) {}

  async execute(
    input: ListSeasoningTemplatesInput,
  ): Promise<ListSeasoningTemplatesOutput> {
    const result = await this.repository.findAll({
      search: input.search,
      pagination: {
        page: input.page,
        limit: input.pageSize,
      },
    });

    const data = result.items.map((item) =>
      ListSeasoningTemplatesMapper.toSeasoningTemplateListItemDto(item),
    );

    const hasNext = result.totalPages > 0 && result.page < result.totalPages;
    const hasPrevious = result.totalPages > 0 && result.page > 1;

    const meta: PaginationMeta = {
      page: result.page,
      pageSize: result.limit,
      totalItems: result.total,
      totalPages: result.totalPages,
      hasNext,
      hasPrevious,
    };

    return { data, meta };
  }
}
