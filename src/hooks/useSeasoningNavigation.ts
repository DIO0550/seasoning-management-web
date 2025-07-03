import { useRouter } from "next/navigation";

/**
 * 調味料関連の画面遷移を管理するカスタムフック
 */
interface UseSeasoningNavigationReturn {
  /** 調味料追加画面に遷移 */
  navigateToAdd: () => void;
  /** 調味料一覧画面に遷移 */
  navigateToList: () => void;
}

/**
 * 調味料関連の画面遷移を管理するカスタムフック
 *
 * @returns 画面遷移用の関数群
 */
export const useSeasoningNavigation = (): UseSeasoningNavigationReturn => {
  const router = useRouter();

  const navigateToAdd = (): void => {
    try {
      router.push("/seasoning/add");
    } catch (error) {
      // ナビゲーションエラーは静かに処理
      console.warn("Navigation to add page failed:", error);
    }
  };

  const navigateToList = (): void => {
    try {
      router.push("/seasoning/list");
    } catch (error) {
      // ナビゲーションエラーは静かに処理
      console.warn("Navigation to list page failed:", error);
    }
  };

  return {
    navigateToAdd,
    navigateToList,
  };
};
