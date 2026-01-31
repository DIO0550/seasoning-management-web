/**
 * @fileoverview ListSeasoningTemplatesUseCaseのDTO定義
 */

export interface ListSeasoningTemplatesInput {
  page: number;
  pageSize: number;
  search?: string;
}

export interface SeasoningTemplateListItemDto {
  id: number;
  name: string;
  typeId: number;
  imageId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListSeasoningTemplatesOutput {
  data: SeasoningTemplateListItemDto[];
  meta: PaginationMeta;
}
