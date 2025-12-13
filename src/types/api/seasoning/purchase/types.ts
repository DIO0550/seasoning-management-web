import { z } from "zod";
import {
  seasoningPurchaseRequestSchema,
  seasoningPurchaseResponseSchema,
} from "@/types/api/seasoning/purchase/schemas";

export type SeasoningPurchaseRequest = z.infer<
  typeof seasoningPurchaseRequestSchema
>;
export type SeasoningPurchaseResponse = z.infer<
  typeof seasoningPurchaseResponseSchema
>;
