import type { Seasoning } from "@/domain/entities/seasoning/seasoning";
import { utcDateToString } from "@/utils/date-conversion";
import type { RegisterPurchaseOutput } from "@/features/seasonings/usecases/register-purchase/dto";

const toRequiredDateString = (value: Date | null): string => {
  const converted = utcDateToString(value);
  if (!converted) {
    throw new Error("購入日が存在しません");
  }
  return converted;
};

export class RegisterPurchaseMapper {
  static toDetailDto(entity: Seasoning, typeName: string): RegisterPurchaseOutput {
    return {
      id: entity.id,
      name: entity.name,
      typeId: entity.typeId,
      typeName,
      imageId: entity.imageId,
      bestBeforeAt: utcDateToString(entity.bestBeforeAt),
      expiresAt: utcDateToString(entity.expiresAt),
      purchasedAt: toRequiredDateString(entity.purchasedAt),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
