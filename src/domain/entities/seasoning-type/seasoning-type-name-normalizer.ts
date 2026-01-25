export const normalizeSeasoningTypeName = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};
