import { expect, test } from "vitest";
import { CreateSeasoningTypeMapper } from "@/features/seasoning-types/usecases/create-seasoning-type/mapper";

test("CreateSeasoningTypeMapper.toDetailDto: エンティティをDTOに変換する", () => {
  const entity = {
    id: 1,
    name: "液体調味料",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  };

  const result = CreateSeasoningTypeMapper.toDetailDto(entity);

  expect(result).toEqual({
    id: 1,
    name: "液体調味料",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  });
});
