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

const seasonings: SeasoningRecord[] = [];

export const seasoningStore = {
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
