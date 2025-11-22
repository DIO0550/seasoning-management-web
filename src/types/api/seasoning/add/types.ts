import { z } from "zod";
import {
  seasoningAddRequestSchema,
  seasoningAddResponseSchema,
} from "@/types/api/seasoning/add/schemas";

export type SeasoningAddRequest = z.infer<typeof seasoningAddRequestSchema>;
export type SeasoningAddResponse = z.infer<typeof seasoningAddResponseSchema>;
