import { z } from "zod";
import {
  paginationSchema,
  type PaginationMeta,
} from "@/types/api/common/pagination";

/**
 * 一般的な成功レスポンスのスキーマ
 */
export const successResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) => {
  return z.object({
    data: dataSchema,
  });
};

/**
 * ページネーション付きレスポンスのスキーマ
 */
export const paginatedResponseSchema = <
  TItem extends z.ZodTypeAny,
  TSummary extends z.ZodTypeAny | undefined = undefined
>(
  itemSchema: TItem,
  options?: { summarySchema?: TSummary }
) => {
  const baseShape = {
    data: z.array(itemSchema),
    meta: paginationSchema,
  } as const;

  if (options?.summarySchema) {
    return z.object({
      ...baseShape,
      summary: options.summarySchema,
    });
  }

  return z.object(baseShape);
};

/**
 * data フィールドのみを持つレスポンス型
 */
export type DataResponse<T> = {
  data: T;
};

/**
 * ページネーション付きレスポンス型
 */
type SummaryPart<TSummary> = TSummary extends undefined
  ? Record<string, never>
  : { summary: TSummary };

export type PaginatedResponse<TItem, TSummary = undefined> = DataResponse<
  TItem[]
> & {
  meta: PaginationMeta;
} & SummaryPart<TSummary>;
