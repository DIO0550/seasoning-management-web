import { z } from "zod";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, "日付はYYYY-MM-DD形式で入力してください")
  .refine(
    (val) => {
      // 文字列が有効な日付であることを検証（例: 2025-02-30 は無効）
      const [year, month, day] = val.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      // Date が入力と一致することを確認（タイムゾーンの影響を排除）
      return (
        !Number.isNaN(date.getTime()) &&
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day
      );
    },
    { message: "有効な日付を入力してください" }
  );

const nullableDateStringSchema = dateStringSchema.nullable();
const optionalNullableDateStringSchema = nullableDateStringSchema.optional();

/**
 * 調味料追加リクエストのスキーマ
 */
export const seasoningAddRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "調味料名は必須です")
    .max(256, "調味料名は256文字以内です"),
  typeId: z
    .number({ message: "調味料の種類を選択してください" })
    .int()
    .min(1, "調味料の種類を選択してください"),
  imageId: z
    .number()
    .int()
    .min(1, "画像IDは1以上で指定してください")
    .nullable()
    .optional(),
  bestBeforeAt: optionalNullableDateStringSchema,
  expiresAt: optionalNullableDateStringSchema,
  purchasedAt: optionalNullableDateStringSchema,
});

/**
 * 調味料データのスキーマ
 */
const seasoningDataSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  typeId: z.number().int().positive(),
  typeName: z.string(),
  imageId: z.number().int().positive().nullable(),
  bestBeforeAt: nullableDateStringSchema,
  expiresAt: nullableDateStringSchema,
  purchasedAt: nullableDateStringSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 調味料追加レスポンスのスキーマ
 */
export const seasoningAddResponseSchema = z.object({
  data: seasoningDataSchema,
});
