import { renderHook, act } from "@testing-library/react";
import { useTemplateDescriptionInput } from "./useTemplateDescriptionInput";

describe("useTemplateDescriptionInput", () => {
  test("初期値が空文字である", () => {
    const { result } = renderHook(() => useTemplateDescriptionInput());

    expect(result.current.value).toBe("");
    expect(result.current.error).toBe("");
    expect(result.current.isValid).toBe(true);
  });

  test("有効な説明を入力した場合", () => {
    const { result } = renderHook(() => useTemplateDescriptionInput());

    act(() => {
      result.current.handleChange("朝食に使う調味料のテンプレートです。");
    });

    expect(result.current.value).toBe("朝食に使う調味料のテンプレートです。");
    expect(result.current.error).toBe("");
    expect(result.current.isValid).toBe(true);
  });

  test("201文字以上を入力した場合", () => {
    const { result } = renderHook(() => useTemplateDescriptionInput());
    const longDescription = "あ".repeat(201);

    act(() => {
      result.current.handleChange(longDescription);
    });

    expect(result.current.value).toBe(longDescription);
    expect(result.current.error).toBe("説明は200文字以内で入力してください。");
    expect(result.current.isValid).toBe(false);
  });
});
