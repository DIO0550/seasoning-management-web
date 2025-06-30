import { render, screen, fireEvent } from "@testing-library/react";
import { TemplateAddForm } from "./TemplateAddForm";

describe("TemplateAddForm", () => {
  test("フォーム要素が表示される", () => {
    render(<TemplateAddForm />);

    expect(
      screen.getByRole("textbox", { name: /テンプレート名/ })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("説明")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
  });

  test("テンプレート名を入力できる", () => {
    render(<TemplateAddForm />);

    const nameInput = screen.getByRole("textbox", { name: /テンプレート名/ });
    fireEvent.change(nameInput, { target: { value: "朝食セット" } });

    expect(nameInput).toHaveValue("朝食セット");
  });

  test("説明を入力できる", () => {
    render(<TemplateAddForm />);

    const descriptionInput = screen.getByLabelText("説明");
    fireEvent.change(descriptionInput, { target: { value: "テスト説明" } });

    expect(descriptionInput).toHaveValue("テスト説明");
  });

  test("テンプレート名が必須でない場合は送信ボタンが無効になる", () => {
    render(<TemplateAddForm />);

    const submitButton = screen.getByRole("button", { name: "追加" });
    expect(submitButton).toBeDisabled();
  });

  test("有効なテンプレート名を入力すると送信ボタンが有効になる", () => {
    render(<TemplateAddForm />);

    const nameInput = screen.getByRole("textbox", { name: /テンプレート名/ });
    fireEvent.change(nameInput, { target: { value: "朝食セット" } });

    const submitButton = screen.getByRole("button", { name: "追加" });
    expect(submitButton).toBeEnabled();
  });
});
