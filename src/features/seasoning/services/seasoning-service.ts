import type {
  ISeasoningRepository,
  ISeasoningTypeRepository,
  SeasoningCreateInput,
} from "@/infrastructure/database/interfaces";
import { Seasoning } from "@/libs/database/entities/seasoning";
import { VALIDATION_CONSTANTS } from "@/constants/validation";

// 依存性注入用型
interface Dependencies {
  seasoningRepository: ISeasoningRepository;
  seasoningTypeRepository: ISeasoningTypeRepository;
}

// Service層のページネーション結果型（Repositoryの実装詳細を隠蔽）
interface SeasoningListResult {
  seasonings: readonly Seasoning[];
  totalCount: number;
}

// ビジネスロジック用の型定義
interface NewSeasoningData {
  name: string;
  typeId: number;
  imageId?: number;
}

interface PurchasedSeasoningData {
  name: string;
  typeId: number;
  purchasedAt: Date;
  expiresAt?: Date;
  bestBeforeAt?: Date;
  imageId?: number;
}

async function getSeasoningList({
  seasoningRepository,
}: Dependencies): Promise<readonly Seasoning[]> {
  const paginatedResult = await seasoningRepository.findAll();

  // Service層ではRepositoryの実装詳細を隠蔽し、純粋な配列を返す
  return paginatedResult.items;
}

async function getSeasoningListWithTotal({
  seasoningRepository,
}: Dependencies): Promise<SeasoningListResult> {
  const paginatedResult = await seasoningRepository.findAll();

  // Service層の抽象化レベルでページネーション情報を提供
  return {
    seasonings: paginatedResult.items,
    totalCount: paginatedResult.total,
  };
}

async function getSeasoningById(
  id: number,
  { seasoningRepository }: Dependencies
): Promise<Seasoning | null> {
  return await seasoningRepository.findById(id);
}

async function addSeasoning(
  data: SeasoningCreateInput,
  { seasoningRepository }: Dependencies
): Promise<Seasoning> {
  // 直接作成したSeasoningエンティティを返す（データベースラウンドトリップを削減）
  return await seasoningRepository.create(data);
}

/**
 * 新しい調味料を追加する（ビジネスロジック込み）
 */
async function addNewSeasoning(
  data: NewSeasoningData,
  { seasoningRepository, seasoningTypeRepository }: Dependencies
): Promise<Seasoning> {
  // ビジネスルールの検証
  if (!data.name || data.name.trim() === "") {
    throw new Error("調味料名は必須です");
  }

  if (data.name.length > VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH) {
    throw new Error(
      `調味料名は${VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH}文字以内で入力してください`
    );
  }

  // 調味料種類の存在確認
  const seasoningType = await seasoningTypeRepository.findById(data.typeId);
  if (!seasoningType) {
    throw new Error("指定された調味料種類が見つかりません");
  }

  // データベースに保存
  const createInput: SeasoningCreateInput = {
    name: data.name.trim(),
    typeId: data.typeId,
    imageId: data.imageId || null,
  };

  const created = await seasoningRepository.create(createInput);

  return created;
}

/**
 * 購入した調味料を登録する（ビジネスロジック込み）
 */
async function registerPurchasedSeasoning(
  data: PurchasedSeasoningData,
  { seasoningRepository, seasoningTypeRepository }: Dependencies
): Promise<Seasoning> {
  // ビジネスルールの検証
  if (!data.name || data.name.trim() === "") {
    throw new Error("調味料名は必須です");
  }

  if (!data.purchasedAt) {
    throw new Error("購入日は必須です");
  }

  // 購入日が未来の日付でないかチェック
  if (data.purchasedAt > new Date()) {
    throw new Error("購入日は今日以前の日付を指定してください");
  }

  // 調味料種類の存在確認
  const seasoningType = await seasoningTypeRepository.findById(data.typeId);
  if (!seasoningType) {
    throw new Error("指定された調味料種類が見つかりません");
  }

  // 消費期限・賞味期限の整合性チェック
  if (data.expiresAt && data.bestBeforeAt) {
    if (data.expiresAt < data.bestBeforeAt) {
      throw new Error("消費期限は賞味期限より後の日付を指定してください");
    }
  }

  // データベースに保存
  const createInput: SeasoningCreateInput = {
    name: data.name.trim(),
    typeId: data.typeId,
    purchasedAt: data.purchasedAt,
    expiresAt: data.expiresAt || null,
    bestBeforeAt: data.bestBeforeAt || null,
    imageId: data.imageId || null,
  };

  return await seasoningRepository.create(createInput);
}

// Service層として適切な抽象化レベルでエクスポート
export const SeasoningService = {
  getSeasoningList,
  getSeasoningListWithTotal,
  getSeasoningById,
  addSeasoning,
  addNewSeasoning,
  registerPurchasedSeasoning,
};
