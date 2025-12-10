import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SeasoningAddForm } from "@/components/forms/seasoning/SeasoningAddForm";
import { vi, beforeEach, afterEach } from "vitest";

const mockSeasoningTypes = [
  { id: 1, name: "塩" },
  { id: 2, name: "砂糖" },
];

describe("SeasoningAddForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockSeasoningTypes }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("種類一覧取得中はローディングメッセージを表示する", async () => {
    let resolveFetch: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(
      fetchPromise as unknown as ReturnType<typeof fetch>
    );

    render(<SeasoningAddForm />);

    expect(screen.getByText("種類を読み込み中です...")).toBeInTheDocument();

    resolveFetch({
      ok: true,
      json: async () => ({ data: mockSeasoningTypes }),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test("種類一覧取得に失敗した場合にエラーメッセージを表示する", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    render(<SeasoningAddForm />);

    await waitFor(() => {
      expect(
        screen.getByText("調味料の種類一覧の取得に失敗しました")
      ).toBeInTheDocument();
    });
  });

  test("renders the form with all required fields", async () => {
    render(<SeasoningAddForm />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Check if all form elements are present
    expect(screen.getByRole("textbox", { name: /調味料/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/調味料の種類/)).toBeInTheDocument();
    expect(screen.getByLabelText(/調味料の画像/)).toBeInTheDocument();
    // 「追加」で終わるボタン（送信ボタン）を取得
    expect(screen.getByRole("button", { name: /^追加$/ })).toBeInTheDocument();
  });

  test("disables submit button when required fields are empty", () => {
    render(<SeasoningAddForm />);

    // Submit button should be disabled initially
    const submitButton = screen.getByRole("button", { name: /^追加$/ });
    expect(submitButton).toBeDisabled();
  });

  test("enables submit button when all required fields are filled", async () => {
    render(<SeasoningAddForm />);

    // Wait for seasoning types to be loaded
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Wait for select options to be populated
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "塩" })).toBeInTheDocument();
    });

    // Fill in required fields (name must be alphanumeric)
    fireEvent.change(screen.getByRole("textbox", { name: /調味料/ }), {
      target: { value: "salt123" },
    });
    fireEvent.change(screen.getByLabelText(/調味料の種類/), {
      target: { value: "1" },
    });

    // Submit button should become enabled
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^追加$/ })).not.toBeDisabled();
    });
  });

  test("validates name field on blur", async () => {
    render(<SeasoningAddForm />);

    // Focus on name input, then blur without entering value
    const nameInput = screen.getByRole("textbox", { name: /調味料/ });
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);

    // Error message should appear
    await waitFor(() => {
      expect(screen.getByText("調味料名は必須です")).toBeInTheDocument();
    });
  });

  test("validates type field on blur", async () => {
    render(<SeasoningAddForm />);

    // Focus on type select, then blur without selecting an option
    const typeSelect = screen.getByLabelText(/調味料の種類/);
    fireEvent.focus(typeSelect);
    fireEvent.blur(typeSelect);

    // Error message should appear
    await waitFor(() => {
      expect(
        screen.getByText("調味料の種類を選択してください")
      ).toBeInTheDocument();
    });
  });

  test("calls onSubmit when form is submitted", async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SeasoningAddForm onSubmit={mockOnSubmit} />);

    // Wait for seasoning types to be loaded
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Wait for select options to be populated
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "塩" })).toBeInTheDocument();
    });

    // Fill in required fields (name must be alphanumeric)
    const nameInput = screen.getByRole("textbox", { name: /調味料/ });
    const typeSelect = screen.getByLabelText(/調味料の種類/);

    fireEvent.change(nameInput, {
      target: { value: "salt123" },
    });
    fireEvent.change(typeSelect, {
      target: { value: "1" },
    });

    // トリガーフィールドのblurイベントでバリデーションを実行
    fireEvent.blur(nameInput);
    fireEvent.blur(typeSelect);

    // Wait for button to be enabled
    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: /^追加$/ })
        ).not.toBeDisabled();
      },
      { timeout: 2000 }
    );

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /^追加$/ }));

    // Check if onSubmit was called
    await waitFor(
      () => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: "salt123",
          type: "1",
          image: null,
        });
      },
      { timeout: 2000 }
    );
  });
});
