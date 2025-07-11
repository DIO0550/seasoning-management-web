import { renderHook, act } from "@testing-library/react";
import { useTemplateSubmit } from "@/hooks/useTemplateSubmit";
import { SUBMIT_ERROR_STATES } from "@/types/submitErrorState";

describe("useTemplateSubmit", () => {
  test("初期状態では送信中でない", () => {
    const { result } = renderHook(() => useTemplateSubmit());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(SUBMIT_ERROR_STATES.NONE);
  });

  test("送信処理が実行される", async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useTemplateSubmit(mockOnSubmit));

    const formData = {
      name: "テストテンプレート",
      description: "テスト用の説明",
      seasoningIds: ["seasoning1", "seasoning2"],
    };

    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(formData);
    expect(result.current.error).toBe(SUBMIT_ERROR_STATES.NONE);
  });

  test("送信中はisSubmittingがtrueになる", async () => {
    let resolveSubmit: () => void;
    const mockOnSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    const { result } = renderHook(() => useTemplateSubmit(mockOnSubmit));

    const formData = {
      name: "テストテンプレート",
      description: "テスト用の説明",
      seasoningIds: ["seasoning1", "seasoning2"],
    };

    act(() => {
      result.current.handleSubmit(formData);
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolveSubmit!();
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  test("ネットワークエラーが発生した場合はNETWORK_ERRORを返す", async () => {
    const networkError = new Error("Network Error");
    networkError.name = "NetworkError";
    const mockOnSubmit = vi.fn().mockRejectedValue(networkError);
    const { result } = renderHook(() => useTemplateSubmit(mockOnSubmit));

    const formData = {
      name: "テストテンプレート",
      description: "テスト用の説明",
      seasoningIds: ["seasoning1"],
    };

    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    expect(result.current.error).toBe("NETWORK_ERROR");
  });

  test("バリデーションエラーが発生した場合はVALIDATION_ERRORを返す", async () => {
    const validationError = new Error("Validation failed");
    validationError.name = "ValidationError";
    const mockOnSubmit = vi.fn().mockRejectedValue(validationError);
    const { result } = renderHook(() => useTemplateSubmit(mockOnSubmit));

    const formData = {
      name: "テストテンプレート",
      description: "テスト用の説明",
      seasoningIds: ["seasoning1"],
    };

    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    expect(result.current.error).toBe("VALIDATION_ERROR");
  });

  test("予期しないエラーが発生した場合はUNKNOWN_ERRORを返す", async () => {
    const unknownError = new Error("Something went wrong");
    const mockOnSubmit = vi.fn().mockRejectedValue(unknownError);
    const { result } = renderHook(() => useTemplateSubmit(mockOnSubmit));

    const formData = {
      name: "テストテンプレート",
      description: "テスト用の説明",
      seasoningIds: ["seasoning1"],
    };

    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    expect(result.current.error).toBe("UNKNOWN_ERROR");
  });
});
