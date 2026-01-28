export interface UpdateSeasoningTypeInput {
  typeId: number;
  name: string;
}

export interface UpdateSeasoningTypeOutput {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
