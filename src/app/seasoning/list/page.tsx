"use client";

import React from "react";
import { Button } from "@/app/seasoning/../../components/elements/buttons/button";
import { useSeasoningNavigation } from "@/app/seasoning/../../hooks/useSeasoningNavigation";

/**
 * 調味料一覧ページコンポーネント
 *
 * 登録済みの調味料一覧を表示し、新規追加への遷移機能を提供します。
 */
export default function SeasoningListPage(): React.JSX.Element {
  const { navigateToAdd } = useSeasoningNavigation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">調味料一覧</h1>
        <Button
          onClick={navigateToAdd}
          variant="primary"
          size="md"
          className="bg-green-600 hover:bg-green-700"
        >
          追加
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-500 text-center py-8">
          調味料一覧ページは開発中です。
        </p>
      </div>
    </div>
  );
}
