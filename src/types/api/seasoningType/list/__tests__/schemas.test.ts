import { seasoningTypeListResponseSchema } from "@/types/api/seasoningType/list/schemas";

test("一覧レスポンスが正しくパースできる", () => {
  const result = seasoningTypeListResponseSchema.safeParse({
    data: [
      { id: 1, name: "液体調味料" },
      { id: 2, name: "粉末" },
    ],
  });

  expect(result.success).toBe(true);
});

test("idが正の整数でない場合はエラーになる", () => {
  const result = seasoningTypeListResponseSchema.safeParse({
    data: [{ id: 0, name: "無効" }],
  });

  expect(result.success).toBe(false);
});
