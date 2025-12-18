import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useSeasoningTypeAdd } from "@/features/seasoning/hooks/use-seasoning-type-add/use-seasoning-type-add";
import { VALIDATION_ERROR_STATES } from "@/types/validation-error-state";
import { SUBMIT_ERROR_STATES } from "@/types/submit-error-state";
import { TEST_ASYNC_DELAY } from "@/constants/ui";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";

describe("useSeasoningTypeAdd", () => {
  describe("初期状態", () => {
    test("初期状態が正しく設定されること", () => {
      const { result } = renderHook(() => useSeasoningTypeAdd());

      expect(result.current.name).toBe("");
      expect(result.current.error).toBe(VALIDATION_ERROR_STATES.NONE);
      expect(result.current.submitError).toBe(SUBMIT_ERROR_STATES.NONE);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isFormValid).toBe(false);
    });
  });

  describe("名前の入力処理", () => {
    test("名前を正しく更新できること", () => {
      const { result } = renderHook(() => useSeasoningTypeAdd());

      act(() => {
        result.current.onChange({
          target: { value: "新しい調味料タイプ" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.name).toBe("新しい調味料タイプ");
    });

    test("有効な名前でフォームが有効になること", () => {
      const { result } = renderHook(() => useSeasoningTypeAdd());

      act(() => {
        result.current.onChange({
          target: { value: "新しい調味料タイプ" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.isFormValid).toBe(true);
    });
  });

  describe("バリデーション", () => {
    test("空の名前でバリデーションエラーが表示されること", () => {
      const { result } = renderHook(() => useSeasoningTypeAdd());

      act(() => {
        result.current.onBlur({
          target: { value: "" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe(VALIDATION_ERROR_STATES.REQUIRED);
      expect(result.current.isFormValid).toBe(false);
    });

    test("最大文字数を超える名前でバリデーションエラーが表示されること", () => {
      const { result } = renderHook(() => useSeasoningTypeAdd());
      const longName = "あ".repeat(SEASONING_TYPE_NAME_MAX_LENGTH + 1);

      act(() => {
        result.current.onChange({
          target: { value: longName },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe(VALIDATION_ERROR_STATES.TOO_LONG);
      expect(result.current.isFormValid).toBe(false);
    });

    test("最大文字数ちょうどの名前でエラーが発生しないこと", () => {
      const { result } = renderHook(() => useSeasoningTypeAdd());
      const maxLengthName = "あ".repeat(SEASONING_TYPE_NAME_MAX_LENGTH);

      act(() => {
        result.current.onChange({
          target: { value: maxLengthName },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.error).toBe(VALIDATION_ERROR_STATES.NONE);
      expect(result.current.isFormValid).toBe(true);
    });
  });

  describe("送信処理", () => {
    test("有効なデータで送信が成功すること", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnSuccess = vi.fn();
      const { result } = renderHook(() =>
        useSeasoningTypeAdd(mockOnSubmit, mockOnSuccess)
      );

      act(() => {
        result.current.onChange({
          target: { value: "新しい調味料タイプ" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "新しい調味料タイプ",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(result.current.name).toBe("");
      expect(result.current.error).toBe(VALIDATION_ERROR_STATES.NONE);
      expect(result.current.submitError).toBe(SUBMIT_ERROR_STATES.NONE);
    });

    test("送信中の状態が正しく管理されること", async () => {
      let resolvePromise: () => void;
      const mockOnSubmit = vi.fn().mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolvePromise = resolve;
          })
      );
      const { result } = renderHook(() => useSeasoningTypeAdd(mockOnSubmit));

      act(() => {
        result.current.onChange({
          target: { value: "新しい調味料タイプ" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      // 送信を開始（非同期でpromiseを返す）
      act(() => {
        result.current.submit();
      });

      // 送信中であることを確認
      expect(result.current.isSubmitting).toBe(true);

      // promiseを解決
      await act(async () => {
        resolvePromise();
        await new Promise((resolve) => setTimeout(resolve, TEST_ASYNC_DELAY)); // Promiseの解決を待つ
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    test("送信エラーが適切に処理されること", async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error("送信エラー"));
      const { result } = renderHook(() => useSeasoningTypeAdd(mockOnSubmit));

      act(() => {
        result.current.onChange({
          target: { value: "新しい調味料タイプ" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(result.current.submitError).toBe(
        SUBMIT_ERROR_STATES.UNKNOWN_ERROR
      );
      expect(result.current.isSubmitting).toBe(false);
    });

    test("ネットワークエラーが適切に処理されること", async () => {
      const networkError = new Error("Network Error");
      networkError.name = "NetworkError";
      const mockOnSubmit = vi.fn().mockRejectedValue(networkError);
      const { result } = renderHook(() => useSeasoningTypeAdd(mockOnSubmit));

      act(() => {
        result.current.onChange({
          target: { value: "新しい調味料タイプ" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(result.current.submitError).toBe(
        SUBMIT_ERROR_STATES.NETWORK_ERROR
      );
      expect(result.current.isSubmitting).toBe(false);
    });

    test("サーバーエラーが適切に処理されること", async () => {
      const serverError = new Error("Server Error occurred");
      const mockOnSubmit = vi.fn().mockRejectedValue(serverError);
      const { result } = renderHook(() => useSeasoningTypeAdd(mockOnSubmit));

      act(() => {
        result.current.onChange({
          target: { value: "新しい調味料タイプ" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(result.current.submitError).toBe(SUBMIT_ERROR_STATES.SERVER_ERROR);
      expect(result.current.isSubmitting).toBe(false);
    });

    test("バリデーションエラーがある場合は送信されないこと", async () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => useSeasoningTypeAdd(mockOnSubmit));

      await act(async () => {
        await result.current.submit();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(result.current.error).toBe(VALIDATION_ERROR_STATES.REQUIRED);
    });
  });

  describe("リセット処理", () => {
    test("resetが呼ばれた時に状態がリセットされること", () => {
      const { result } = renderHook(() => useSeasoningTypeAdd());

      // 値を設定
      act(() => {
        result.current.onChange({
          target: { value: "テスト" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.name).toBe("テスト");

      // エラーも設定
      act(() => {
        result.current.onBlur({
          target: { value: "" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      // リセット
      act(() => {
        result.current.reset();
      });

      expect(result.current.name).toBe("");
      expect(result.current.error).toBe(VALIDATION_ERROR_STATES.NONE);
      expect(result.current.submitError).toBe(SUBMIT_ERROR_STATES.NONE);
      expect(result.current.isFormValid).toBe(false);
    });
  });
});
