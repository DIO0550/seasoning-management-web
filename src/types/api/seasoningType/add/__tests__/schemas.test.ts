import { seasoningTypeAddRequestSchema } from "@/types/api/seasoningType/add/schemas";

test("有効な名前でバリデーションが通る", () => {
  const result = seasoningTypeAddRequestSchema.safeParse({ name: "液体調味料" });

  expect(result.success).toBe(true);
});

test("名前が空だとバリデーションエラーになる", () => {
  const result = seasoningTypeAddRequestSchema.safeParse({ name: "" });

  expect(result.success).toBe(false);
});

test("名前が51文字以上だとバリデーションエラーになる", () => {
  const longName = "あ".repeat(51);

  const result = seasoningTypeAddRequestSchema.safeParse({ name: longName });

  expect(result.success).toBe(false);
});
