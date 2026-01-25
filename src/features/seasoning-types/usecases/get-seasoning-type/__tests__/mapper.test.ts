import { expect, test } from "vitest";
import { GetSeasoningTypeMapper } from "@/features/seasoning-types/usecases/get-seasoning-type/mapper";
import { SeasoningType } from "@/libs/database/entities/seasoning-type";

test("GetSeasoningTypeMapper.toDetailDto: エンティティをDTOに変換する", () => {
  const entity = new SeasoningType({
    id: 1,
    name: "液体調味料",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  });

  const result = GetSeasoningTypeMapper.toDetailDto(entity);

  expect(result).toEqual({
    id: 1,
    name: "液体調味料",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  });
});
