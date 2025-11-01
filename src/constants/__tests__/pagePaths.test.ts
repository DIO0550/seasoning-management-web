import { test, expect } from "vitest";
import {
  SEASONING_PAGE_PATHS,
  type SeasoningPagePath,
} from "@/constants/pagePaths";

// ページパス定数値の確認
test("SEASONING_PAGE_PATHS - 調味料一覧ページのパスが正しく定義されている", () => {
  expect(SEASONING_PAGE_PATHS.LIST).toBe("/seasoning/list");
});

test("SEASONING_PAGE_PATHS - 調味料追加ページのパスが正しく定義されている", () => {
  expect(SEASONING_PAGE_PATHS.ADD).toBe("/seasoning/add");
});

// ページパス定数の型チェック
test("SEASONING_PAGE_PATHS - オブジェクトが正しい構造を持つ", () => {
  expect(SEASONING_PAGE_PATHS).toEqual({
    LIST: "/seasoning/list",
    ADD: "/seasoning/add",
  });
});

test("SEASONING_PAGE_PATHS - ページパス定数が文字列型である", () => {
  expect(typeof SEASONING_PAGE_PATHS.LIST).toBe("string");
  expect(typeof SEASONING_PAGE_PATHS.ADD).toBe("string");
});

// 型定義の確認
test("SEASONING_PAGE_PATHS - SeasoningPagePath型が正しく動作する", () => {
  const listPath: SeasoningPagePath = SEASONING_PAGE_PATHS.LIST;
  const addPath: SeasoningPagePath = SEASONING_PAGE_PATHS.ADD;

  expect(listPath).toBe("/seasoning/list");
  expect(addPath).toBe("/seasoning/add");
});

// 定数の不変性確認
test("SEASONING_PAGE_PATHS - オブジェクトのキーが期待通りである", () => {
  // TypeScriptの型レベルでreadonlyが保証されていることを確認
  // as constは実行時freezeではない
  expect(Object.isFrozen(SEASONING_PAGE_PATHS)).toBe(false);

  // オブジェクトのキーが期待通りであることを確認
  expect(Object.keys(SEASONING_PAGE_PATHS)).toEqual(["LIST", "ADD"]);
});

// ページパスの形式確認
test("SEASONING_PAGE_PATHS - すべてのページパスが/seasoningで始まる", () => {
  Object.values(SEASONING_PAGE_PATHS).forEach((path) => {
    expect(path).toMatch(/^\/seasoning/);
  });
});

test("SEASONING_PAGE_PATHS - すべてのページパスが有効な形式である", () => {
  Object.values(SEASONING_PAGE_PATHS).forEach((path) => {
    // パスが / で始まり、英数字とハイフンのみを含むことを確認
    expect(path).toMatch(/^\/[a-z0-9\/\-]+$/);
  });
});
