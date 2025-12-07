import { seasoningTypeAddRequestSchema } from "@/types/api/seasoningType/add/schemas";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

test("有効な名前でバリデーションが通る", () => {
  const result = seasoningTypeAddRequestSchema.safeParse({
    name: "液体調味料",
  });

  expect(result.success).toBe(true);
});

test("名前が空だとバリデーションエラーになる", () => {
  const result = seasoningTypeAddRequestSchema.safeParse({ name: "" });

  expect(result.success).toBe(false);
});

test("名前が最大文字数を超えるとバリデーションエラーになる", () => {
  const longName = "あ".repeat(SEASONING_TYPE_NAME_MAX_LENGTH + 1);

  const result = seasoningTypeAddRequestSchema.safeParse({ name: longName });

  expect(result.success).toBe(false);
});
