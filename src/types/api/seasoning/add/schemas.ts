import { z } from "zod";
import { isValidDateString } from "@/utils/date-conversion";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, "日付はYYYY-MM-DD形式で入力してください")
  .refine((val) => isValidDateString(val), {
    message: "有効な日付を入力してください",
  });

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
    // imageId: undefined（省略）、null、または1以上の整数
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
