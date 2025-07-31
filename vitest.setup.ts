import "@testing-library/jest-dom";

// CSS imports をモック化
import { vi } from "vitest";

// CSS ファイルの import をモック化
vi.mock("*.css", () => ({}));
vi.mock("*.scss", () => ({}));
vi.mock("*.sass", () => ({}));
