import { z } from "zod";
import { SEASONING_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";
import { isValidDateString } from "@/utils/date-conversion";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, "日付はYYYY-MM-DD形式で入力してください")
  .refine((val) => isValidDateString(val), {
    message: "有効な日付を入力してください",
  });

const nullableDateStringSchema = dateStringSchema.nullable();
const optionalNullableDateStringSchema = nullableDateStringSchema.optional();

const getTodayJstDateString = (): string => {
  return new Date()
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Tokyo",
    })
    .replace(/\//gu, "-");
};

/**
 * 購入調味料登録リクエストのスキーマ
 */
export const seasoningPurchaseRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "調味料名は必須です")
    .max(
      SEASONING_NAME_MAX_LENGTH,
      `調味料名は${SEASONING_NAME_MAX_LENGTH}文字以内で入力してください`
    ),
  typeId: z
    .number({ message: "調味料の種類を選択してください" })
    .int()
    .positive("調味料の種類を選択してください"),
  purchasedAt: dateStringSchema
    .refine((val) => val <= getTodayJstDateString(), {
      message: "購入日は未来の日付にできません",
    })
    .describe("購入日"),
  expiresAt: optionalNullableDateStringSchema,
  bestBeforeAt: optionalNullableDateStringSchema,
  imageId: z.number().int().positive().nullable().optional(),
});

const seasoningDataSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  typeId: z.number().int().positive(),
  typeName: z.string(),
  imageId: z.number().int().positive().nullable(),
  bestBeforeAt: nullableDateStringSchema,
  expiresAt: nullableDateStringSchema,
  purchasedAt: dateStringSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 購入調味料登録レスポンスのスキーマ
 */
export const seasoningPurchaseResponseSchema = z.object({
  data: seasoningDataSchema,
});
