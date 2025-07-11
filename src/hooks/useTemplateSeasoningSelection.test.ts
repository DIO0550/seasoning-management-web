import { renderHook, act } from "@testing-library/react";
import { useTemplateSeasoningSelection } from "@/hooks/useTemplateSeasoningSelection";

describe("useTemplateSeasoningSelection", () => {
  test("初期値が空配列である", () => {
    const { result } = renderHook(() => useTemplateSeasoningSelection());

    expect(result.current.selectedSeasoningIds).toEqual([]);
    expect(result.current.isValid).toBe(true); // 調味料選択は任意のため
  });

  test("調味料を選択できる", () => {
    const { result } = renderHook(() => useTemplateSeasoningSelection());

    act(() => {
      result.current.handleSeasoningToggle("seasoning1");
    });

    expect(result.current.selectedSeasoningIds).toEqual(["seasoning1"]);
    expect(result.current.isValid).toBe(true);
  });

  test("選択済みの調味料を再度選択すると選択解除される", () => {
    const { result } = renderHook(() => useTemplateSeasoningSelection());

    act(() => {
      result.current.handleSeasoningToggle("seasoning1");
    });

    act(() => {
      result.current.handleSeasoningToggle("seasoning1");
    });

    expect(result.current.selectedSeasoningIds).toEqual([]);
    expect(result.current.isValid).toBe(true);
  });

  test("複数の調味料を選択できる", () => {
    const { result } = renderHook(() => useTemplateSeasoningSelection());

    act(() => {
      result.current.handleSeasoningToggle("seasoning1");
    });

    act(() => {
      result.current.handleSeasoningToggle("seasoning2");
    });

    expect(result.current.selectedSeasoningIds).toEqual([
      "seasoning1",
      "seasoning2",
    ]);
    expect(result.current.isValid).toBe(true);
  });
});
