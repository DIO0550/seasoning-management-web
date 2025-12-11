import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, afterEach } from "vitest";
import { SeasoningAddForm } from "@/components/forms/seasoning/SeasoningAddForm";
import { FormData } from "@/features/seasoning/hooks";

const createFetchMock = () => {
  const fetchMock = vi.fn();

  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      data: [
        { id: 1, name: "液体" },
        { id: 2, name: "粉末" },
      ],
    }),
  });

  return fetchMock;
};

const renderForm = (onSubmit?: (data: FormData) => Promise<void>) => {
  render(<SeasoningAddForm onSubmit={onSubmit} />);
};

afterEach(() => {
  vi.restoreAllMocks();
});

test("初期表示でAPIから種類一覧を取得して選択肢を表示する", async () => {
  const fetchMock = createFetchMock();
  global.fetch = fetchMock;

  renderForm();

  await waitFor(() =>
    expect(screen.getByRole("option", { name: "液体" })).toBeInTheDocument()
  );

  expect(fetchMock).toHaveBeenCalledWith("/api/seasoning-types", {
    method: "GET",
  });
});

test("モーダルで種類を追加するとリストに反映され選択される", async () => {
  const fetchMock = createFetchMock();
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      data: {
        id: 3,
        name: "新しい種類",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    }),
  });
  global.fetch = fetchMock;

  renderForm();

  await waitFor(() =>
    expect(screen.getByRole("option", { name: "液体" })).toBeInTheDocument()
  );

  await userEvent.click(
    screen.getByRole("button", { name: "新しい調味料の種類を追加" })
  );

  await userEvent.type(
    screen.getByLabelText(/調味料の種類名/),
    "新しい種類"
  );
  await userEvent.click(screen.getByRole("button", { name: "保存" }));

  await waitFor(() =>
    expect(
      screen.getByText("調味料の種類を追加しました")
    ).toBeInTheDocument()
  );

  const newlyAddedOption = screen.getByRole("option", { name: "新しい種類" });
  expect(newlyAddedOption).toBeInTheDocument();
  expect(
    (screen.getByLabelText(/調味料の種類/) as HTMLSelectElement).value
  ).toBe("3");
});

test("モーダルで名前を空のまま保存するとバリデーションエラーを表示する", async () => {
  const fetchMock = createFetchMock();
  global.fetch = fetchMock;

  renderForm();

  await waitFor(() =>
    expect(screen.getByRole("option", { name: "液体" })).toBeInTheDocument()
  );

  await userEvent.click(
    screen.getByRole("button", { name: "新しい調味料の種類を追加" })
  );

  await userEvent.click(screen.getByRole("button", { name: "保存" }));

  expect(
    await screen.findByText("調味料の種類名は必須です")
  ).toBeInTheDocument();
});
