import { renderHook, act } from "@testing-library/react";
import { useTemplateDescriptionInput } from "@/features/template/hooks/use-template-description-input/use-template-description-input";

const renderUseTemplateDescriptionInput = () =>
  renderHook(() => useTemplateDescriptionInput());

test("初期値は空文字でエラー無し", () => {
  const { result } = renderUseTemplateDescriptionInput();

  expect(result.current.value).toBe("");
  expect(result.current.error).toBe("");
  expect(result.current.isValid).toBe(true);
});

test("有効な説明を入力するとエラーが発生しない", () => {
  const { result } = renderUseTemplateDescriptionInput();

  act(() => {
    result.current.handleChange("朝食に使う調味料のテンプレートです。");
  });

  expect(result.current.value).toBe("朝食に使う調味料のテンプレートです。");
  expect(result.current.error).toBe("");
  expect(result.current.isValid).toBe(true);
});

test("201文字以上を入力すると制限エラーが返る", () => {
  const { result } = renderUseTemplateDescriptionInput();
  const longDescription = "あ".repeat(201);

  act(() => {
    result.current.handleChange(longDescription);
  });

  expect(result.current.value).toBe(longDescription);
  expect(result.current.error).toBe(
    "説明は200文字以内で入力してください。"
  );
  expect(result.current.isValid).toBe(false);
});
