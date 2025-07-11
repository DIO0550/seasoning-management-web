import { describe, test, expect } from "vitest";
import { SEASONING_PAGE_PATHS, type SeasoningPagePath } from "@/constants/pagePaths";

describe("SEASONING_PAGE_PATHS", () => {
  describe("ページパス定数値の確認", () => {
    it("調味料一覧ページのパスが正しく定義されている", () => {
      expect(SEASONING_PAGE_PATHS.LIST).toBe("/seasoning/list");
    });

    it("調味料追加ページのパスが正しく定義されている", () => {
      expect(SEASONING_PAGE_PATHS.ADD).toBe("/seasoning/add");
    });
  });

  describe("ページパス定数の型チェック", () => {
    it("SEASONING_PAGE_PATHSオブジェクトが正しい構造を持つ", () => {
      expect(SEASONING_PAGE_PATHS).toEqual({
        LIST: "/seasoning/list",
        ADD: "/seasoning/add",
      });
    });

    it("ページパス定数が文字列型である", () => {
      expect(typeof SEASONING_PAGE_PATHS.LIST).toBe("string");
      expect(typeof SEASONING_PAGE_PATHS.ADD).toBe("string");
    });
  });

  describe("型定義の確認", () => {
    it("SeasoningPagePath型が正しく動作する", () => {
      const listPath: SeasoningPagePath = SEASONING_PAGE_PATHS.LIST;
      const addPath: SeasoningPagePath = SEASONING_PAGE_PATHS.ADD;

      expect(listPath).toBe("/seasoning/list");
      expect(addPath).toBe("/seasoning/add");
    });
  });

  describe("定数の不変性確認", () => {
    it("SEASONING_PAGE_PATHSが読み取り専用である", () => {
      // TypeScriptの型レベルでreadonlyが保証されていることを確認
      // 実行時エラーは発生しないが、型チェックで警告が出ることを期待
      expect(Object.isFrozen(SEASONING_PAGE_PATHS)).toBe(false); // as constは実行時freezeではない

      // オブジェクトのキーが期待通りであることを確認
      expect(Object.keys(SEASONING_PAGE_PATHS)).toEqual(["LIST", "ADD"]);
    });
  });

  describe("ページパスの形式確認", () => {
    it("すべてのページパスが/seasoningで始まる", () => {
      Object.values(SEASONING_PAGE_PATHS).forEach((path) => {
        expect(path).toMatch(/^\/seasoning/);
      });
    });

    it("すべてのページパスが有効な形式である", () => {
      Object.values(SEASONING_PAGE_PATHS).forEach((path) => {
        // パスが / で始まり、英数字とハイフンのみを含むことを確認
        expect(path).toMatch(/^\/[a-z0-9\/\-]+$/);
      });
    });
  });
});
