import { z } from "zod";
import {
  seasoningTemplateListItemSchema,
  seasoningTemplateListQuerySchema,
  seasoningTemplateListResponseSchema,
} from "@/types/api/seasoning-template/list/schemas";

export type SeasoningTemplateListItem = z.infer<
  typeof seasoningTemplateListItemSchema
>;
export type SeasoningTemplateListQuery = z.infer<
  typeof seasoningTemplateListQuerySchema
>;
export type SeasoningTemplateListResponse = z.infer<
  typeof seasoningTemplateListResponseSchema
>;

export {
  errorDetailSchema,
  type ErrorDetail,
  errorResponseSchema,
  type ErrorResponse,
} from "@/types/api/common/error";
