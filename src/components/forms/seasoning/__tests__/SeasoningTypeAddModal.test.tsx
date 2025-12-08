import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi, beforeEach } from "vitest";
import { SeasoningTypeAddModal } from "@/components/forms/seasoning/SeasoningTypeAddModal";
import * as hooks from "@/features/seasoning/hooks";

// モックの設定
vi.mock("@/features/seasoning/hooks", async () => {
  const actual = await vi.importActual("@/features/seasoning/hooks");
  return {
    ...actual,
    useSeasoningTypeAdd: vi.fn(),
  };
});

const mockOnClose = vi.fn();
const mockOnAdded = vi.fn();
const mockSubmit = vi.fn();
const mockReset = vi.fn();
const mockOnChange = vi.fn();
const mockOnBlur = vi.fn();

const defaultHookValues = {
  name: "",
  error: "NONE",
  submitError: null,
  isSubmitting: false,
  onBlur: mockOnBlur,
  onChange: mockOnChange,
  submit: mockSubmit,
  reset: mockReset,
};

beforeEach(() => {
  vi.clearAllMocks();
  (hooks.useSeasoningTypeAdd as ReturnType<typeof vi.fn>).mockReturnValue(
    defaultHookValues
  );
});

it("isOpenがfalseの場合、何もレンダリングされないこと", () => {
  const { container } = render(
    <SeasoningTypeAddModal
      isOpen={false}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );
  expect(container).toBeEmptyDOMElement();
});

it("isOpenがtrueの場合、モーダルがレンダリングされること", () => {
  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText("調味料の種類を追加")).toBeInTheDocument();
});

it("閉じるボタンをクリックするとonCloseが呼ばれること", () => {
  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );
  const closeButton = screen.getByLabelText("閉じる");
  fireEvent.click(closeButton);
  expect(mockReset).toHaveBeenCalled();
  expect(mockOnClose).toHaveBeenCalled();
});

it("キャンセルボタンをクリックするとonCloseが呼ばれること", () => {
  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );
  const cancelButton = screen.getByText("キャンセル");
  fireEvent.click(cancelButton);
  expect(mockReset).toHaveBeenCalled();
  expect(mockOnClose).toHaveBeenCalled();
});

it("保存ボタンをクリックするとsubmitが呼ばれること", () => {
  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );
  const saveButton = screen.getByText("保存");
  fireEvent.click(saveButton);
  expect(mockSubmit).toHaveBeenCalled();
});

it("バリデーションエラーがある場合、エラーメッセージが表示されること", () => {
  (hooks.useSeasoningTypeAdd as ReturnType<typeof vi.fn>).mockReturnValue({
    ...defaultHookValues,
    error: "REQUIRED",
  });

  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );
  expect(screen.getByText("調味料の種類名は必須です")).toBeInTheDocument();
});

it("送信エラーがある場合、エラーメッセージが表示されること", () => {
  (hooks.useSeasoningTypeAdd as ReturnType<typeof vi.fn>).mockReturnValue({
    ...defaultHookValues,
    submitError: "NETWORK_ERROR",
  });

  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );
  expect(
    screen.getByText(
      "通信エラーが発生しました。しばらくしてから再度お試しください"
    )
  ).toBeInTheDocument();
});

it("モーダル表示時に入力へ初期フォーカスが移動すること", () => {
  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );

  expect(document.activeElement?.id).toBe("seasoning-type-name");
});

it("Escapeキーでモーダルが閉じられること", () => {
  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );

  fireEvent.keyDown(document, { key: "Escape" });

  expect(mockReset).toHaveBeenCalled();
  expect(mockOnClose).toHaveBeenCalled();
});

it("Tabキーでフォーカスがモーダル内を循環すること", async () => {
  const user = userEvent.setup();
  render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );

  const saveButton = screen.getByRole("button", { name: "保存" });
  saveButton.focus();

  await user.tab();
  expect(screen.getByLabelText("閉じる")).toHaveFocus();

  await user.tab();
  expect(document.getElementById("seasoning-type-name")).toHaveFocus();
});

it("モーダル表示中は背景スクロールが無効化され、閉じると復元されること", () => {
  const { rerender } = render(
    <SeasoningTypeAddModal
      isOpen={true}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );

  expect(document.body.style.overflow).toBe("hidden");

  rerender(
    <SeasoningTypeAddModal
      isOpen={false}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  );

  expect(document.body.style.overflow).toBe("");
});
