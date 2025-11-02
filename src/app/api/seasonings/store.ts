/**
 * API ルートとテストで共有するモックストア
 */

export interface SeasoningRecord {
  id: string;
  name: string;
  seasoningTypeId: number;
  image?: string;
  createdAt: string;
}

export interface SeasoningStore {
  list(): SeasoningRecord[];
  add(record: SeasoningRecord): void;
  findByName(name: string): SeasoningRecord | undefined;
  clear(): void;
}

/**
 * インスタンスごとに独立したストアを生成するファクトリ関数
 * @description テスト間での状態共有を防ぐため、各インスタンスが独立した配列を持つ
 */
export function createSeasoningStore(): SeasoningStore {
  const seasonings: SeasoningRecord[] = [];

  return {
    list(): SeasoningRecord[] {
      return [...seasonings];
    },
    add(record: SeasoningRecord): void {
      seasonings.push(record);
    },
    findByName(name: string): SeasoningRecord | undefined {
      return seasonings.find((seasoning) => seasoning.name === name);
    },
    clear(): void {
      seasonings.length = 0;
    },
  };
}

/**
 * グローバルなストアインスタンス（後方互換性のため）
 * @deprecated 新しいコードでは createSeasoningStore() を使用してください
 */
export const seasoningStore = createSeasoningStore();
