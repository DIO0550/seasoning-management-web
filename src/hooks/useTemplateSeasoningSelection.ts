import { useState } from "react";

/**
 * テンプレート調味料選択のカスタムフック
 */
export const useTemplateSeasoningSelection = () => {
  const [selectedSeasoningIds, setSelectedSeasoningIds] = useState<string[]>(
    []
  );

  const handleSeasoningToggle = (seasoningId: string) => {
    setSelectedSeasoningIds((prev) => {
      if (prev.includes(seasoningId)) {
        return prev.filter((id) => id !== seasoningId);
      } else {
        return [...prev, seasoningId];
      }
    });
  };

  const isValid = true; // 調味料選択は任意のため常にtrue

  return {
    selectedSeasoningIds,
    isValid,
    handleSeasoningToggle,
  };
};
