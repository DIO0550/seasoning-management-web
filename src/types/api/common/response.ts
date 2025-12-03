import { z } from "zod";
import {
  paginationSchema,
  type PaginationMeta,
} from "@/types/api/common/pagination";

/**
 * 一般的な成功レスポンスのスキーマを生成する
 * @param dataSchema - レスポンスの data フィールドに格納されるデータのスキーマ
 * @returns data フィールドを持つオブジェクトスキーマ
 */
export const successResponseSchema = <T extends z.ZodType>(dataSchema: T) => {
  return z.object({
    data: dataSchema,
  });
};

/**
 * ページネーション付きレスポンスのスキーマを生成する
 *
 * @param itemSchema - 配列内の各アイテムのスキーマ
 * @param options - オプション設定
 * @param options.summarySchema - サマリー情報のスキーマ。指定した場合のみ `summary` フィールドが必須で追加される。未指定の場合は `summary` を持たないレスポンスを許容する。
 * @returns data, meta, および任意で summary フィールドを持つオブジェクトスキーマ
 *
 * @example
 * // サマリーなし
 * const schema = paginatedResponseSchema(itemSchema);
 *
 * @example
 * // サマリーあり
 * const schema = paginatedResponseSchema(itemSchema, { summarySchema: summarySchema });
 */
export const paginatedResponseSchema = <
  TItem extends z.ZodType,
  TSummary extends z.ZodType | undefined = undefined
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

// 内部型: TSummary が undefined の場合は空オブジェクト、それ以外は { summary: TSummary } を表す
type SummaryPart<TSummary> = TSummary extends undefined
  ? Record<string, never>
  : { summary: TSummary };

export type PaginatedResponse<TItem, TSummary = undefined> = DataResponse<
  TItem[]
> & {
  meta: PaginationMeta;
} & SummaryPart<TSummary>;
