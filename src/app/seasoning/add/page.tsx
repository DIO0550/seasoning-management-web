"use client";

import React from "react";
import { SeasoningAddForm } from "@/components/forms/seasoning/SeasoningAddForm";
import { FormData } from "@/features/seasoning/hooks";
import { useSeasoningNavigation } from "@/features/seasoning/hooks";
import { Button } from "@/components/elements/buttons/button";

/**
 * 調味料追加ページコンポーネント
 *
 * 調味料を新規追加するためのページです。
 * SeasoningAddFormを使用してフォーム機能を提供します。
 */
export default function SeasoningAddPage(): React.JSX.Element {
  const { navigateToList } = useSeasoningNavigation();

  /**
   * 一覧画面への戻る処理
   */
  const handleBackToList = (): void => {
    navigateToList();
  };
  /**
   * フォーム送信時の処理
   *
   * @param data - 送信されるフォームデータ
   */
  const handleSubmit = async (data: FormData): Promise<void> => {
    try {
      // TODO: APIエンドポイントへの送信処理を実装
      console.log("調味料データを送信:", data);

      // 成功時の処理（一覧画面への遷移）
      navigateToList();
    } catch (error) {
      console.error("調味料の追加に失敗しました:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">調味料を追加</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToList}
              className="text-gray-600 hover:text-gray-800"
            >
              ← 一覧に戻る
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            新しい調味料の情報を入力してください。
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <SeasoningAddForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
