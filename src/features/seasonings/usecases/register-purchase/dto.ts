/**
 * @fileoverview 購入調味料登録UseCase DTO定義
 */

export interface RegisterPurchaseInput {
  name: string;
  typeId: number;
  purchasedAt: string;
  imageId?: number | null;
  bestBeforeAt?: string | null;
  expiresAt?: string | null;
}

export interface RegisterPurchaseOutput {
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  imageId: number | null;
  bestBeforeAt: string | null;
  expiresAt: string | null;
  purchasedAt: string;
  createdAt: string;
  updatedAt: string;
}
