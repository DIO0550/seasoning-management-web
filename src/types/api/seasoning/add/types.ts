import { z } from "zod";
import {
  seasoningAddRequestSchema,
  seasoningAddResponseSchema,
} from "./schemas";

/**
 * 調味料追加リクエストの型
 */
export type SeasoningAddRequest = z.infer<typeof seasoningAddRequestSchema>;

/**
 * 調味料追加レスポンスの型
 */
export type SeasoningAddResponse = z.infer<typeof seasoningAddResponseSchema>;
