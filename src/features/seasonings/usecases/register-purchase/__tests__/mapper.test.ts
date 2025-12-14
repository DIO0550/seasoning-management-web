import { expect, test } from "vitest";
import { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { RegisterPurchaseMapper } from "../mapper";

test("RegisterPurchaseMapper.toDetailDto: Seasoning EntityをPurchasedSeasoningDetailDtoに変換する", () => {
  const entity = new Seasoning({
    id: 10,
    name: "醤油",
    typeId: 2,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: new Date("2025-12-31T00:00:00.000Z"),
    purchasedAt: new Date("2025-11-01T00:00:00.000Z"),
    createdAt: new Date("2025-11-10T12:00:00.000Z"),
    updatedAt: new Date("2025-11-11T12:00:00.000Z"),
  });

  expect(RegisterPurchaseMapper.toDetailDto(entity, "液体調味料")).toEqual({
    id: 10,
    name: "醤油",
    typeId: 2,
    typeName: "液体調味料",
    imageId: null,
    bestBeforeAt: null,
    expiresAt: "2025-12-31",
    purchasedAt: "2025-11-01",
    createdAt: "2025-11-10T12:00:00.000Z",
    updatedAt: "2025-11-11T12:00:00.000Z",
  });
});

test("RegisterPurchaseMapper.toDetailDto: purchasedAtがnullの場合は例外になる", () => {
  const entity = new Seasoning({
    id: 10,
    name: "醤油",
    typeId: 2,
    imageId: null,
    bestBeforeAt: null,
    expiresAt: null,
    purchasedAt: null,
    createdAt: new Date("2025-11-10T12:00:00.000Z"),
    updatedAt: new Date("2025-11-11T12:00:00.000Z"),
  });

  expect(() =>
    RegisterPurchaseMapper.toDetailDto(entity, "液体調味料")
  ).toThrow("購入日が存在しません");
});
