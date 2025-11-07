import { renderHook, act } from "@testing-library/react";
import { useTemplateNameInput } from "@/features/template/hooks/use-template-name-input/use-template-name-input";

const renderUseTemplateNameInput = () =>
  renderHook(() => useTemplateNameInput());

test("初期値は空文字でバリデーションも未通過", () => {
  const { result } = renderUseTemplateNameInput();

  expect(result.current.value).toBe("");
  expect(result.current.error).toBe("");
  expect(result.current.isValid).toBe(false);
});

test("有効な名前を入力するとエラーが消えisValidになる", () => {
  const { result } = renderUseTemplateNameInput();

  act(() => {
    result.current.handleChange("朝食セット");
  });

  expect(result.current.value).toBe("朝食セット");
  expect(result.current.error).toBe("");
  expect(result.current.isValid).toBe(true);
});

test("空文字を入力すると必須エラーとなりisValidがfalse", () => {
  const { result } = renderUseTemplateNameInput();

  act(() => {
    result.current.handleChange("");
  });

  expect(result.current.value).toBe("");
  expect(result.current.error).toBe("テンプレート名は必須です。");
  expect(result.current.isValid).toBe(false);
});

test("257文字以上を入力すると文字数制限のエラーを返す", () => {
  const { result } = renderUseTemplateNameInput();
  const longName = "あ".repeat(257);

  act(() => {
    result.current.handleChange(longName);
  });

  expect(result.current.value).toBe(longName);
  expect(result.current.error).toBe(
    "テンプレート名は256文字以内で入力してください。"
  );
  expect(result.current.isValid).toBe(false);
});
