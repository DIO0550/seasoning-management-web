import { z } from 'zod';
import { 
  seasoningListQuerySchema,
  seasoningListResponseSchema 
} from './schemas';

/**
 * 調味料一覧クエリパラメータの型
 */
export type SeasoningListQuery = z.infer<typeof seasoningListQuerySchema>;

/**
 * 調味料一覧レスポンスの型
 */
export type SeasoningListResponse = z.infer<typeof seasoningListResponseSchema>;
