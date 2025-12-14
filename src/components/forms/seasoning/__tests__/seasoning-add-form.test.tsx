import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SeasoningAddForm } from "@/components/forms/seasoning/SeasoningAddForm";
import { vi, beforeEach, afterEach } from "vitest";

const mockSeasoningTypes = [
  { id: 1, name: "塩" },
  { id: 2, name: "砂糖" },
];

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
  let resolveFetch!: (value: unknown) => void;
  const fetchPromise = new Promise((resolve) => {
    resolveFetch = resolve;
  });

  global.fetch = vi
    .fn()
    .mockReturnValue(fetchPromise as unknown as ReturnType<typeof fetch>);

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

test("必須フィールドを表示する", async () => {
  render(<SeasoningAddForm />);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  expect(screen.getByRole("textbox", { name: /調味料/ })).toBeInTheDocument();
  expect(screen.getByLabelText(/調味料の種類/)).toBeInTheDocument();
  expect(screen.getByLabelText(/調味料の画像/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^追加$/ })).toBeInTheDocument();
});

test("必須項目が空のとき送信ボタンが無効", () => {
  render(<SeasoningAddForm />);

  const submitButton = screen.getByRole("button", { name: /^追加$/ });
  expect(submitButton).toBeDisabled();
});

test("必須項目を入力すると送信ボタンが有効", async () => {
  render(<SeasoningAddForm />);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "塩" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByRole("textbox", { name: /調味料/ }), {
    target: { value: "salt123" },
  });
  fireEvent.change(screen.getByLabelText(/調味料の種類/), {
    target: { value: "1" },
  });

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /^追加$/ })).not.toBeDisabled();
  });
});

test("調味料名のblurでバリデーションが動く", async () => {
  render(<SeasoningAddForm />);

  const nameInput = screen.getByRole("textbox", { name: /調味料/ });
  fireEvent.focus(nameInput);
  fireEvent.blur(nameInput);

  await waitFor(() => {
    expect(screen.getByText("調味料名は必須です")).toBeInTheDocument();
  });
});

test("種類のblurでバリデーションが動く", async () => {
  render(<SeasoningAddForm />);

  const typeSelect = screen.getByLabelText(/調味料の種類/);
  fireEvent.focus(typeSelect);
  fireEvent.blur(typeSelect);

  await waitFor(() => {
    expect(
      screen.getByText("調味料の種類を選択してください")
    ).toBeInTheDocument();
  });
});

test("フォーム送信で onSubmit が呼ばれる", async () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
  render(<SeasoningAddForm onSubmit={mockOnSubmit} />);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "塩" })).toBeInTheDocument();
  });

  const nameInput = screen.getByRole("textbox", { name: /調味料/ });
  const typeSelect = screen.getByLabelText(/調味料の種類/);

  fireEvent.change(nameInput, {
    target: { value: "salt123" },
  });
  fireEvent.change(typeSelect, {
    target: { value: "1" },
  });

  fireEvent.blur(nameInput);
  fireEvent.blur(typeSelect);

  await waitFor(
    () => {
      expect(screen.getByRole("button", { name: /^追加$/ })).not.toBeDisabled();
    },
    { timeout: 2000 }
  );

  fireEvent.click(screen.getByRole("button", { name: /^追加$/ }));

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
