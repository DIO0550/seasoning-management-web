import { renderHook, act } from "@testing-library/react";
import { useSeasoningTypeInput } from "@/features/seasoning/hooks/use-seasoning-type-input/use-seasoning-type-input";

describe("useSeasoningTypeInput", () => {
  test("初期値が空文字でエラーがないこと", () => {
    const { result } = renderHook(() => useSeasoningTypeInput());

    expect(result.current.value).toBe("");
    expect(result.current.error).toBe("");
  });

  test("onChangeが呼ばれた時に値が更新されること", () => {
    const { result } = renderHook(() => useSeasoningTypeInput());

    act(() => {
      result.current.onChange({
        target: { value: "salt" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.value).toBe("salt");
  });

  test("空の値でブラーした時に必須バリデーションが動作すること", () => {
    const { result } = renderHook(() => useSeasoningTypeInput());

    act(() => {
      result.current.onBlur({
        target: { value: "" },
      } as React.FocusEvent<HTMLSelectElement>);
    });

    expect(result.current.error).toBe("調味料の種類を選択してください");
  });

  test("有効な種類が選択された時にエラーが表示されないこと", () => {
    const { result } = renderHook(() => useSeasoningTypeInput());

    act(() => {
      result.current.onChange({
        target: { value: "salt" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    act(() => {
      result.current.onBlur({
        target: { value: "salt" },
      } as React.FocusEvent<HTMLSelectElement>);
    });

    expect(result.current.error).toBe("");
  });

  test("変更時にもバリデーションが動作すること", () => {
    const { result } = renderHook(() => useSeasoningTypeInput());

    // 有効な値を設定
    act(() => {
      result.current.onChange({
        target: { value: "salt" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.error).toBe("");

    // 空の値に変更
    act(() => {
      result.current.onChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.error).toBe("調味料の種類を選択してください");
  });

  test("無効な値の後に有効な値を選択した時にエラーがクリアされること", () => {
    const { result } = renderHook(() => useSeasoningTypeInput());

    // 空の値を設定してエラーを発生させる
    act(() => {
      result.current.onChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.error).toBe("調味料の種類を選択してください");

    // 有効な値を選択
    act(() => {
      result.current.onChange({
        target: { value: "salt" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.error).toBe("");
  });

  test("resetが呼ばれた時に値とエラーがリセットされること", () => {
    const { result } = renderHook(() => useSeasoningTypeInput());

    // 値とエラーを設定
    act(() => {
      result.current.onChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.value).toBe("");
    expect(result.current.error).toBe("調味料の種類を選択してください");

    // リセット
    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe("");
    expect(result.current.error).toBe("");
  });
});
