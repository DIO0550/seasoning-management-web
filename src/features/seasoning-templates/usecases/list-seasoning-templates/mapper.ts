/**
 * @fileoverview ListSeasoningTemplatesMapper - Domain Entity ↔ DTO変換
 */

import type { SeasoningTemplate } from "@/libs/database/entities/seasoning-template";
import type { SeasoningTemplateListItemDto } from "@/features/seasoning-templates/usecases/list-seasoning-templates/dto";

export class ListSeasoningTemplatesMapper {
  static toSeasoningTemplateListItemDto(
    entity: SeasoningTemplate,
  ): SeasoningTemplateListItemDto {
    return {
      id: entity.id,
      name: entity.name,
      typeId: entity.typeId,
      imageId: entity.imageId ?? null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
