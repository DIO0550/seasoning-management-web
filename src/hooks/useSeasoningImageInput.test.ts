import { renderHook, act } from "@testing-library/react";
import { useSeasoningImageInput } from "./useSeasoningImageInput";

describe("useSeasoningImageInput", () => {
  test("初期値がnullでエラーがないこと", () => {
    const { result } = renderHook(() => useSeasoningImageInput());

    expect(result.current.value).toBeNull();
    expect(result.current.error).toBe("");
  });

  test("有効な画像ファイルを設定できること", () => {
    const { result } = renderHook(() => useSeasoningImageInput());

    const validFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    act(() => {
      result.current.onChange(validFile);
    });

    expect(result.current.value).toBe(validFile);
    expect(result.current.error).toBe("");
  });

  test("無効なファイル形式でエラーが表示されること", () => {
    const { result } = renderHook(() => useSeasoningImageInput());

    const invalidFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });

    act(() => {
      result.current.onChange(invalidFile);
    });

    expect(result.current.value).toBe(invalidFile);
    expect(result.current.error).toBe(
      "JPEG、PNG 形式のファイルを選択してください"
    );
  });
});
