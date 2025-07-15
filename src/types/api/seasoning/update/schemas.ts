import { z } from "zod";
import { successResponseSchema } from "@/types/api/common/schemas";

/**
 * 調味料更新リクエストのスキーマ
 */
export const seasoningUpdateRequestSchema = z.object({
  id: z
    .number({ message: "IDは必須です" })
    .int()
    .positive("IDは正の整数である必要があります"),
  name: z
    .string()
    .min(1, "調味料名は必須です")
    .max(20, "調味料名は20文字以内で入力してください")
    .refine((val) => val === "" || /^[a-zA-Z0-9]+$/.test(val), {
      message: "調味料名は半角英数字で入力してください",
    }),
  seasoningTypeId: z
    .number({ message: "調味料の種類を選択してください" })
    .int()
    .min(1, "調味料の種類を選択してください"),
  image: z.string().nullable().optional(),
  bestBeforeAt: z.string().date().nullable().optional(),
  expiresAt: z.string().date().nullable().optional(),
  purchasedAt: z.string().date().nullable().optional(),
});

/**
 * 調味料データのスキーマ
 */
const seasoningDataSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  seasoningTypeId: z.number().int().positive(),
  seasoningTypeName: z.string(),
  imageUrl: z.string().nullable(),
  bestBeforeAt: z.string().date().nullable(),
  expiresAt: z.string().date().nullable(),
  purchasedAt: z.string().date().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 調味料更新レスポンスのスキーマ
 */
export const seasoningUpdateResponseSchema =
  successResponseSchema(seasoningDataSchema);
