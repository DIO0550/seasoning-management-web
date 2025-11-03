/**
 * Home Page コンポーネントのテスト
 * @description トップページの表示とナビゲーション機能をテストする
 */

import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Button コンポーネントをモック
vi.mock("@/components/elements/buttons/button", () => ({
  Button: ({
    children,
    variant,
    size,
  }: {
    children: React.ReactNode;
    variant: string;
    size: string;
  }) => (
    <button data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

// Next.js Link をモック
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe("Home Page", () => {
  describe("ページタイトル", () => {
    test("メインタイトルが表示される", () => {
      // Act
      render(<Home />);

      // Assert
      expect(screen.getByText("調味料管理アプリへ")).toBeInTheDocument();
      expect(screen.getByText("ようこそ")).toBeInTheDocument();
    });

    test("タイトルが適切なクラス名を持つ", () => {
      // Act
      render(<Home />);

      // Assert
      const titleElement = screen.getByRole("heading", { level: 1 });
      expect(titleElement).toHaveClass(
        "text-4xl",
        "font-extrabold",
        "tracking-tight",
        "text-gray-900"
      );
    });

    test("「ようこそ」部分に青色のスタイルが適用される", () => {
      // Act
      render(<Home />);

      // Assert
      const welcomeSpan = screen.getByText("ようこそ");
      expect(welcomeSpan).toHaveClass("block", "text-blue-600");
    });
  });

  describe("説明文", () => {
    test("アプリの説明文が表示される", () => {
      // Act
      render(<Home />);

      // Assert
      const description = screen.getByText(
        "調味料の管理を簡単に。期限切れを防ぎ、必要な調味料を常に把握できます。"
      );
      expect(description).toBeInTheDocument();
    });

    test("説明文が適切なスタイルを持つ", () => {
      // Act
      render(<Home />);

      // Assert
      const description = screen.getByText(
        "調味料の管理を簡単に。期限切れを防ぎ、必要な調味料を常に把握できます。"
      );
      expect(description).toHaveClass(
        "mt-3",
        "max-w-md",
        "mx-auto",
        "text-base",
        "text-gray-500"
      );
    });
  });

  describe("ナビゲーションボタン", () => {
    test("調味料一覧へのリンクが表示される", () => {
      // Act
      render(<Home />);

      // Assert
      const seasoningLink = screen.getByRole("link", { name: /調味料一覧/ });
      expect(seasoningLink).toBeInTheDocument();
      expect(seasoningLink).toHaveAttribute("href", "/seasoning/list");
    });

    test("テンプレート一覧へのリンクが表示される", () => {
      // Act
      render(<Home />);

      // Assert
      const templateLink = screen.getByRole("link", {
        name: /テンプレート一覧/,
      });
      expect(templateLink).toBeInTheDocument();
      expect(templateLink).toHaveAttribute("href", "/template/list");
    });

    test("調味料一覧ボタンがプライマリスタイルである", () => {
      // Act
      render(<Home />);

      // Assert
      const seasoningButton = screen.getByRole("button", {
        name: "調味料一覧",
      });
      expect(seasoningButton).toHaveAttribute("data-variant", "primary");
      expect(seasoningButton).toHaveAttribute("data-size", "lg");
    });

    test("テンプレート一覧ボタンがアウトラインスタイルである", () => {
      // Act
      render(<Home />);

      // Assert
      const templateButton = screen.getByRole("button", {
        name: "テンプレート一覧",
      });
      expect(templateButton).toHaveAttribute("data-variant", "outline");
      expect(templateButton).toHaveAttribute("data-size", "lg");
    });
  });

  describe("機能紹介セクション", () => {
    test("主な機能のセクションタイトルが表示される", () => {
      // Act
      render(<Home />);

      // Assert
      const featuresTitle = screen.getByRole("heading", {
        level: 2,
        name: "主な機能",
      });
      expect(featuresTitle).toBeInTheDocument();
      expect(featuresTitle).toHaveClass(
        "text-2xl",
        "font-bold",
        "text-gray-900"
      );
    });

    test("調味料の管理機能の説明が表示される", () => {
      // Act
      render(<Home />);

      // Assert
      const managementTitle = screen.getByRole("heading", {
        level: 3,
        name: "調味料の管理",
      });
      expect(managementTitle).toBeInTheDocument();

      const managementDescription = screen.getByText(
        "家庭内の調味料の在庫を簡単に管理。期限切れも防止します。"
      );
      expect(managementDescription).toBeInTheDocument();
    });

    test("テンプレート機能の説明が表示される", () => {
      // Act
      render(<Home />);

      // Assert
      const templateTitle = screen.getByRole("heading", {
        level: 3,
        name: "テンプレート機能",
      });
      expect(templateTitle).toBeInTheDocument();

      const templateDescription = screen.getByText(
        "よく使う調味料の組み合わせをテンプレートとして保存できます。"
      );
      expect(templateDescription).toBeInTheDocument();
    });

    test("簡単操作の説明が表示される", () => {
      // Act
      render(<Home />);

      // Assert
      const easyUseTitle = screen.getByRole("heading", {
        level: 3,
        name: "簡単操作",
      });
      expect(easyUseTitle).toBeInTheDocument();

      const easyUseDescription = screen.getByText(
        "直感的なインターフェースで、誰でも簡単に使用できます。"
      );
      expect(easyUseDescription).toBeInTheDocument();
    });

    test("機能カードが適切なレイアウトを持つ", () => {
      // Act
      render(<Home />);

      // Assert
      const featureCards = screen
        .getAllByText(/^調味料の管理|テンプレート機能|簡単操作$/)
        .map((title) => title.closest("div"))
        .filter((card) => card?.classList.contains("bg-white"));

      expect(featureCards).toHaveLength(3);
      featureCards.forEach((card) => {
        expect(card).toHaveClass("bg-white", "p-6", "rounded-lg", "shadow-md");
      });
    });
  });

  describe("レイアウトとスタイル", () => {
    test("メインコンテナが適切なクラスを持つ", () => {
      // Act
      render(<Home />);

      // Assert
      const container = document.querySelector(".max-w-7xl");
      expect(container).toHaveClass(
        "max-w-7xl",
        "mx-auto",
        "px-4",
        "sm:px-6",
        "lg:px-8",
        "py-12"
      );
    });

    test("中央揃えのコンテナが存在する", () => {
      // Act
      render(<Home />);

      // Assert
      const centeredContainer = screen
        .getByText("調味料管理アプリへ")
        .closest(".text-center");
      expect(centeredContainer).toHaveClass("text-center");
    });

    test("ボタンコンテナが適切なレイアウトを持つ", () => {
      // Act
      render(<Home />);

      // Assert
      const buttonContainer = screen.getByRole("link", {
        name: /調味料一覧/,
      }).parentElement;
      expect(buttonContainer).toHaveClass(
        "mt-10",
        "flex",
        "justify-center",
        "gap-4"
      );
    });

    test("機能紹介グリッドが適切なレイアウトを持つ", () => {
      // Act
      render(<Home />);

      // Assert
      const gridContainer = screen
        .getByRole("heading", { level: 3, name: "調味料の管理" })
        .closest(".grid");
      expect(gridContainer).toHaveClass(
        "mt-6",
        "grid",
        "grid-cols-1",
        "gap-8",
        "md:grid-cols-2",
        "lg:grid-cols-3"
      );
    });
  });

  describe("アクセシビリティ", () => {
    test("適切な見出し階層が存在する", () => {
      // Act
      render(<Home />);

      // Assert
      const h1 = screen.getByRole("heading", { level: 1 });
      const h2 = screen.getByRole("heading", { level: 2 });
      const h3Elements = screen.getAllByRole("heading", { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(h3Elements).toHaveLength(3);
    });

    test("リンクに適切なテキストが含まれている", () => {
      // Act
      render(<Home />);

      // Assert
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link).toHaveTextContent(/調味料一覧|テンプレート一覧/);
      });
    });
  });

  describe("レスポンシブデザイン", () => {
    test("レスポンシブなフォントサイズクラスが適用されている", () => {
      // Act
      render(<Home />);

      // Assert
      const titleElement = screen.getByRole("heading", { level: 1 });
      expect(titleElement).toHaveClass("sm:text-5xl", "md:text-6xl");
    });

    test("レスポンシブなパディングクラスが適用されている", () => {
      // Act
      render(<Home />);

      // Assert
      const container = document.querySelector(".max-w-7xl");
      expect(container).toHaveClass("sm:px-6", "lg:px-8");
    });

    test("レスポンシブなグリッドクラスが適用されている", () => {
      // Act
      render(<Home />);

      // Assert
      const gridContainer = screen
        .getByRole("heading", { level: 3, name: "調味料の管理" })
        .closest(".grid");
      expect(gridContainer).toHaveClass("md:grid-cols-2", "lg:grid-cols-3");
    });
  });
});
