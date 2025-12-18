import { renderHook, act } from "@testing-library/react";
import { useTemplateSubmit } from "@/features/template/hooks/use-template-submit/use-template-submit";
import { SUBMIT_ERROR_STATES } from "@/types/submit-error-state";

const renderUseTemplateSubmit = (
  onSubmit?: Parameters<typeof useTemplateSubmit>[0]
) => renderHook(() => useTemplateSubmit(onSubmit));

const createFormData = () => ({
  name: "テストテンプレート",
  description: "テスト用の説明",
  seasoningIds: ["seasoning1", "seasoning2"],
});

test("初期状態では送信中でなくエラーも無い", () => {
  const { result } = renderUseTemplateSubmit();

  expect(result.current.isSubmitting).toBe(false);
  expect(result.current.error).toBe(SUBMIT_ERROR_STATES.NONE);
});

test("正常に送信するとコールバックが呼ばれエラーはNONEのまま", async () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
  const { result } = renderUseTemplateSubmit(mockOnSubmit);
  const formData = createFormData();

  await act(async () => {
    await result.current.handleSubmit(formData);
  });

  expect(mockOnSubmit).toHaveBeenCalledWith(formData);
  expect(result.current.error).toBe(SUBMIT_ERROR_STATES.NONE);
});

test("送信中はisSubmittingがtrueになり完了後falseになる", async () => {
  let resolveSubmit: () => void;
  const mockOnSubmit = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      })
  );
  const { result } = renderUseTemplateSubmit(mockOnSubmit);
  const formData = createFormData();

  act(() => {
    result.current.handleSubmit(formData);
  });

  expect(result.current.isSubmitting).toBe(true);

  await act(async () => {
    resolveSubmit!();
  });

  expect(result.current.isSubmitting).toBe(false);
});

test("ネットワークエラー時はNETWORK_ERRORを返す", async () => {
  const networkError = new Error("Network Error");
  networkError.name = "NetworkError";
  const mockOnSubmit = vi.fn().mockRejectedValue(networkError);
  const { result } = renderUseTemplateSubmit(mockOnSubmit);
  const formData = { ...createFormData(), seasoningIds: ["seasoning1"] };

  await act(async () => {
    await result.current.handleSubmit(formData);
  });

  expect(result.current.error).toBe("NETWORK_ERROR");
});

test("バリデーションエラー時はVALIDATION_ERRORを返す", async () => {
  const validationError = new Error("Validation failed");
  validationError.name = "validation-error";
  const mockOnSubmit = vi.fn().mockRejectedValue(validationError);
  const { result } = renderUseTemplateSubmit(mockOnSubmit);
  const formData = { ...createFormData(), seasoningIds: ["seasoning1"] };

  await act(async () => {
    await result.current.handleSubmit(formData);
  });

  expect(result.current.error).toBe("VALIDATION_ERROR");
});

test("未知のエラー時はUNKNOWN_ERRORを返す", async () => {
  const unknownError = new Error("Something went wrong");
  const mockOnSubmit = vi.fn().mockRejectedValue(unknownError);
  const { result } = renderUseTemplateSubmit(mockOnSubmit);
  const formData = { ...createFormData(), seasoningIds: ["seasoning1"] };

  await act(async () => {
    await result.current.handleSubmit(formData);
  });

  expect(result.current.error).toBe("UNKNOWN_ERROR");
});
