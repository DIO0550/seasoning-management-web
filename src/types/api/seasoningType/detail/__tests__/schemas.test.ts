import { seasoningTypeDetailResponseSchema } from "@/types/api/seasoningType/detail/schemas";

test("調味料種類詳細レスポンスのスキーマが有効なデータを受け入れる", () => {
  const result = seasoningTypeDetailResponseSchema.safeParse({
    data: {
      id: 1,
      name: "液体調味料",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  });

  expect(result.success).toBe(true);
});

test("調味料種類詳細レスポンスのスキーマが無効なデータを拒否する", () => {
  const result = seasoningTypeDetailResponseSchema.safeParse({
    data: {
      id: 1,
      name: "液体調味料",
      createdAt: "invalid",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  });

  expect(result.success).toBe(false);
});
