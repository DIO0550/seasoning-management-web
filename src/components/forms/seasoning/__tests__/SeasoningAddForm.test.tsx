import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SeasoningAddForm } from "@/components/forms/seasoning/SeasoningAddForm";
import { vi } from "vitest";

describe("SeasoningAddForm", () => {
  test("renders the form with all required fields", () => {
    render(<SeasoningAddForm />);

    // Check if all form elements are present
    expect(screen.getByRole("textbox", { name: /調味料/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/調味料の種類/)).toBeInTheDocument();
    expect(screen.getByLabelText(/調味料の画像/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /追加/ })).toBeInTheDocument();
  });

  test("disables submit button when required fields are empty", () => {
    render(<SeasoningAddForm />);

    // Submit button should be disabled initially
    const submitButton = screen.getByRole("button", { name: /追加/ });
    expect(submitButton).toBeDisabled();
  });

  test("enables submit button when all required fields are filled", async () => {
    render(<SeasoningAddForm />);

    // Fill in required fields
    fireEvent.change(screen.getByRole("textbox", { name: /調味料/ }), {
      target: { value: "salt" },
    });
    fireEvent.change(screen.getByLabelText(/調味料の種類/), {
      target: { value: "salt" },
    });

    // Submit button should become enabled
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /追加/ })).not.toBeDisabled();
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

    // Fill in required fields
    const nameInput = screen.getByRole("textbox", { name: /調味料/ });
    const typeSelect = screen.getByLabelText(/調味料の種類/);

    fireEvent.change(nameInput, {
      target: { value: "salt" },
    });
    fireEvent.change(typeSelect, {
      target: { value: "salt" },
    });

    // トリガーフィールドのblurイベントでバリデーションを実行
    fireEvent.blur(nameInput);
    fireEvent.blur(typeSelect);

    // Wait for button to be enabled
    await waitFor(
      () => {
        expect(screen.getByRole("button", { name: /追加/ })).not.toBeDisabled();
      },
      { timeout: 2000 }
    );

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /追加/ }));

    // Check if onSubmit was called
    await waitFor(
      () => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: "salt",
          type: "salt",
          image: null,
        });
      },
      { timeout: 2000 }
    );
  });
});
