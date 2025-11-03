/**
 * RootLayout コンポーネントのテスト
 * @description Next.js App Router のルートレイアウトをテストする
 */

import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";

// CSS ファイルをモック化してPostCSSエラーを回避
vi.mock("@/app/globals.css", () => ({}));

// Header コンポーネントをモック
vi.mock("@/components/layouts/headers/header", () => ({
  Header: () => <header data-testid="header">Header Component</header>,
}));

describe("RootLayout", () => {
  describe("metadata", () => {
    test("適切なタイトルが設定されている", () => {
      expect(metadata.title).toBe("調味料管理");
    });

    test("適切な説明が設定されている", () => {
      expect(metadata.description).toBe("調味料の管理アプリケーション");
    });

    test("metadataオブジェクトが正しい構造を持つ", () => {
      expect(metadata).toEqual({
        title: "調味料管理",
        description: "調味料の管理アプリケーション",
      });
    });
  });

  describe("レイアウト構造", () => {
    test("HTML lang属性が日本語に設定されている", () => {
      // Arrange
      const TestChild = () => <div>Test Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute("lang", "ja");
    });

    test("bodyにantialiasedクラスが適用されている", () => {
      // Arrange
      const TestChild = () => <div>Test Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      const bodyElement = document.body;
      expect(bodyElement).toHaveClass("antialiased");
    });

    test("Headerコンポーネントがレンダリングされる", () => {
      // Arrange
      const TestChild = () => <div>Test Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      const header = screen.getByTestId("header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent("Header Component");
    });

    test("mainタグにmin-h-screenクラスが適用されている", () => {
      // Arrange
      const TestChild = () => <div data-testid="child">Test Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      const main = screen.getByRole("main");
      expect(main).toHaveClass("min-h-screen");
    });

    test("子コンポーネントが正しくレンダリングされる", () => {
      // Arrange
      const TestChild = () => <div data-testid="child">Test Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      const child = screen.getByTestId("child");
      expect(child).toBeInTheDocument();
      expect(child).toHaveTextContent("Test Content");
    });

    test("複数の子コンポーネントが正しくレンダリングされる", () => {
      // Arrange
      const MultipleChildren = () => (
        <>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </>
      );

      // Act
      render(
        <RootLayout>
          <MultipleChildren />
        </RootLayout>
      );

      // Assert
      expect(screen.getByTestId("child1")).toBeInTheDocument();
      expect(screen.getByTestId("child2")).toBeInTheDocument();
    });
  });

  describe("レスポンシブデザイン", () => {
    test("レイアウトが基本的なHTML構造を持つ", () => {
      // Arrange
      const TestChild = () => <div>Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      expect(document.querySelector("html")).toBeInTheDocument();
      expect(document.querySelector("body")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    test("レイアウトが適切な順序でレンダリングされる", () => {
      // Arrange
      const TestChild = () => <div data-testid="content">Page Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      const body = document.body;
      const header = screen.getByTestId("header");
      const main = screen.getByRole("main");
      const content = screen.getByTestId("content");

      // ヘッダーとメインが存在し、メインの中にコンテンツがある
      expect(body).toContainElement(header);
      expect(body).toContainElement(main);
      expect(main).toContainElement(content);
    });
  });

  describe("アクセシビリティ", () => {
    test("ランドマークロールが適切に設定されている", () => {
      // Arrange
      const TestChild = () => <div>Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    test("言語属性が適切に設定されている", () => {
      // Arrange
      const TestChild = () => <div>Content</div>;

      // Act
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );

      // Assert
      expect(document.documentElement).toHaveAttribute("lang", "ja");
    });
  });

  describe("エラーハンドリング", () => {
    test("null childrenでもエラーにならない", () => {
      // Act & Assert
      expect(() => {
        render(<RootLayout>{null}</RootLayout>);
      }).not.toThrow();
    });

    test("undefined childrenでもエラーにならない", () => {
      // Act & Assert
      expect(() => {
        render(<RootLayout>{undefined}</RootLayout>);
      }).not.toThrow();
    });

    test("空のfragmentでもエラーにならない", () => {
      // Act & Assert
      expect(() => {
        render(
          <RootLayout>
            <></>
          </RootLayout>
        );
      }).not.toThrow();
    });
  });
});
