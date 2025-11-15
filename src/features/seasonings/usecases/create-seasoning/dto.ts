/**
 * @fileoverview 調味料作成UseCase DTO定義
 */

/**
 * 調味料作成Input DTO
 */
export interface CreateSeasoningInput {
  name: string;
  typeId: number;
  imageId?: number | null;
  bestBeforeAt?: string | null;
  expiresAt?: string | null;
  purchasedAt?: string | null;
}

/**
 * 調味料詳細DTO
 */
export interface SeasoningDetailDto {
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  imageId: number | null;
  bestBeforeAt: string | null;
  expiresAt: string | null;
  purchasedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
