import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi, type Mock } from "vitest";
import { SeasoningTypeAddModal } from "@/components/forms/seasoning/SeasoningTypeAddModal";
import { useSeasoningTypeAdd } from "@/features/seasoning/hooks";
import {
  getSeasoningTypeSubmitMessage,
  getSeasoningTypeValidationMessage,
} from "@/features/seasoning/utils";

vi.mock("@/features/seasoning/hooks");
vi.mock("@/features/seasoning/utils");

type SeasoningTypeAddHookReturn = {
  name: string;
  error: string;
  submitError: string;
  isSubmitting: boolean;
  isFormValid: boolean;
  onBlur: (
    event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  submit: () => void | Promise<void>;
  reset: () => void;
};

const createHookReturn = (
  override: Partial<SeasoningTypeAddHookReturn> = {}
): SeasoningTypeAddHookReturn => ({
  name: "",
  error: "",
  submitError: "",
  isSubmitting: false,
  isFormValid: true,
  onBlur: vi.fn(),
  onChange: vi.fn(),
  submit: vi.fn(),
  reset: vi.fn(),
  ...override,
});

const useSeasoningTypeAddMock = useSeasoningTypeAdd as unknown as Mock;
const getSubmitMessageMock = getSeasoningTypeSubmitMessage as unknown as Mock;
const getValidationMessageMock =
  getSeasoningTypeValidationMessage as unknown as Mock;

beforeEach(() => {
  useSeasoningTypeAddMock.mockReturnValue(createHookReturn());
  getSubmitMessageMock.mockReturnValue("");
  getValidationMessageMock.mockReturnValue("");
});

afterEach(() => {
  vi.clearAllMocks();
});

test("モーダルが閉じているときは描画されない", () => {
  render(
    <SeasoningTypeAddModal isOpen={false} onClose={vi.fn()} onAdded={vi.fn()} />
  );

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("閉じるボタンでリセットして閉じられる", async () => {
  const hookReturn = createHookReturn();
  const onClose = vi.fn();
  useSeasoningTypeAddMock.mockReturnValue(hookReturn);

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={onClose} onAdded={vi.fn()} />
  );

  const user = userEvent.setup();
  await user.click(screen.getByLabelText("閉じる"));

  expect(hookReturn.reset).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("キャンセルボタンでリセットして閉じられる", async () => {
  const hookReturn = createHookReturn();
  const onClose = vi.fn();
  useSeasoningTypeAddMock.mockReturnValue(hookReturn);

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={onClose} onAdded={vi.fn()} />
  );

  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "キャンセル" }));

  expect(hookReturn.reset).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("オーバーレイクリックでモーダルが閉じる", async () => {
  const hookReturn = createHookReturn();
  const onClose = vi.fn();
  useSeasoningTypeAddMock.mockReturnValue(hookReturn);

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={onClose} onAdded={vi.fn()} />
  );

  const user = userEvent.setup();
  await user.click(screen.getByTestId("seasoning-type-add-modal-overlay"));

  expect(hookReturn.reset).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("ダイアログ内部をクリックしても閉じない", async () => {
  const hookReturn = createHookReturn();
  const onClose = vi.fn();
  useSeasoningTypeAddMock.mockReturnValue(hookReturn);

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={onClose} onAdded={vi.fn()} />
  );

  const user = userEvent.setup();
  await user.click(screen.getByRole("dialog"));

  expect(onClose).not.toHaveBeenCalled();
});

test("フォームが無効なとき保存ボタンが無効になる", () => {
  useSeasoningTypeAddMock.mockReturnValue(
    createHookReturn({ isFormValid: false })
  );

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={vi.fn()} onAdded={vi.fn()} />
  );

  const saveButton = screen.getByRole("button", { name: "保存" });
  expect(saveButton).toBeDisabled();
});

test("保存ボタンでsubmitが呼ばれる", async () => {
  const submit = vi.fn();
  useSeasoningTypeAddMock.mockReturnValue(createHookReturn({ submit }));

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={vi.fn()} onAdded={vi.fn()} />
  );

  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "保存" }));

  expect(submit).toHaveBeenCalledTimes(1);
});

test("バリデーションエラーメッセージを表示する", () => {
  getValidationMessageMock.mockReturnValue("バリデーションエラー");
  useSeasoningTypeAddMock.mockReturnValue(
    createHookReturn({ error: "invalid" })
  );

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={vi.fn()} onAdded={vi.fn()} />
  );

  expect(screen.getByText("バリデーションエラー")).toBeInTheDocument();
});

test("送信エラーメッセージを表示する", () => {
  getSubmitMessageMock.mockReturnValue("送信に失敗しました");
  useSeasoningTypeAddMock.mockReturnValue(
    createHookReturn({ submitError: "network" })
  );

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={vi.fn()} onAdded={vi.fn()} />
  );

  expect(screen.getByText("送信に失敗しました")).toBeInTheDocument();
});

test("Escapeキーで閉じられる", async () => {
  const hookReturn = createHookReturn();
  const onClose = vi.fn();
  useSeasoningTypeAddMock.mockReturnValue(hookReturn);

  render(
    <SeasoningTypeAddModal isOpen={true} onClose={onClose} onAdded={vi.fn()} />
  );

  const user = userEvent.setup();
  await user.keyboard("{Escape}");

  expect(hookReturn.reset).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});
