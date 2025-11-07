import { renderHook, act } from "@testing-library/react";
import { useTemplateSeasoningSelection } from "@/features/template/hooks/use-template-seasoning-selection/use-template-seasoning-selection";

const renderUseTemplateSeasoningSelection = () =>
  renderHook(() => useTemplateSeasoningSelection());

test("初期状態では選択済みIDが空でisValidはtrue", () => {
  const { result } = renderUseTemplateSeasoningSelection();

  expect(result.current.selectedSeasoningIds).toEqual([]);
  expect(result.current.isValid).toBe(true);
});

test("未選択の調味料をトグルするとIDが追加される", () => {
  const { result } = renderUseTemplateSeasoningSelection();

  act(() => {
    result.current.handleSeasoningToggle("seasoning1");
  });

  expect(result.current.selectedSeasoningIds).toEqual(["seasoning1"]);
  expect(result.current.isValid).toBe(true);
});

test("選択済みの調味料を再トグルすると解除される", () => {
  const { result } = renderUseTemplateSeasoningSelection();

  act(() => {
    result.current.handleSeasoningToggle("seasoning1");
  });
  act(() => {
    result.current.handleSeasoningToggle("seasoning1");
  });

  expect(result.current.selectedSeasoningIds).toEqual([]);
  expect(result.current.isValid).toBe(true);
});

test("複数トグルすると複数IDを保持する", () => {
  const { result } = renderUseTemplateSeasoningSelection();

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
