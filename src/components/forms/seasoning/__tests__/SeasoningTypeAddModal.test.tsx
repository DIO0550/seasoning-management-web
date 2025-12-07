import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SeasoningTypeAddModal } from "../SeasoningTypeAddModal";
import * as hooks from "@/features/seasoning/hooks";

// モックの設定
vi.mock("@/features/seasoning/hooks", async () => {
  const actual = await vi.importActual("@/features/seasoning/hooks");
  return {
    ...actual,
    useSeasoningTypeAdd: vi.fn(),
  };
});

describe("SeasoningTypeAddModal", () => {
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
});
