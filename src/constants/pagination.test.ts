import { describe, it, expect } from "vitest";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
  SEASONING_IMAGE_PAGE_SIZE,
  SEASONING_TYPE_PAGE_SIZE,
  SEASONING_PAGE_SIZE,
  MIN_PAGE_NUMBER,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  calculateOffset,
} from "@/constants/pagination";

describe("pagination constants", () => {
  describe("基本定数", () => {
    it("DEFAULT_PAGE_SIZEが10であること", () => {
      expect(DEFAULT_PAGE_SIZE).toBe(10);
    });

    it("DEFAULT_PAGE_NUMBERが1であること", () => {
      expect(DEFAULT_PAGE_NUMBER).toBe(1);
    });

    it("MIN_PAGE_NUMBERが1であること", () => {
      expect(MIN_PAGE_NUMBER).toBe(1);
    });

    it("MIN_PAGE_SIZEが1であること", () => {
      expect(MIN_PAGE_SIZE).toBe(1);
    });

    it("MAX_PAGE_SIZEが100であること", () => {
      expect(MAX_PAGE_SIZE).toBe(100);
    });
  });

  describe("エンティティ別ページサイズ", () => {
    it("SEASONING_PAGE_SIZEが10であること", () => {
      expect(SEASONING_PAGE_SIZE).toBe(10);
    });

    it("SEASONING_IMAGE_PAGE_SIZEが20であること", () => {
      expect(SEASONING_IMAGE_PAGE_SIZE).toBe(20);
    });

    it("SEASONING_TYPE_PAGE_SIZEが50であること", () => {
      expect(SEASONING_TYPE_PAGE_SIZE).toBe(50);
    });
  });

  describe("calculateOffset関数", () => {
    it("ページ1、サイズ10でオフセット0が計算されること", () => {
      expect(calculateOffset(1, 10)).toBe(0);
    });

    it("ページ2、サイズ10でオフセット10が計算されること", () => {
      expect(calculateOffset(2, 10)).toBe(10);
    });

    it("ページ3、サイズ20でオフセット40が計算されること", () => {
      expect(calculateOffset(3, 20)).toBe(40);
    });

    it("ページ1、サイズ1でオフセット0が計算されること", () => {
      expect(calculateOffset(1, 1)).toBe(0);
    });
  });

  describe("型安全性", () => {
    it("全ての定数がnumber型であること", () => {
      expect(typeof DEFAULT_PAGE_SIZE).toBe("number");
      expect(typeof DEFAULT_PAGE_NUMBER).toBe("number");
      expect(typeof SEASONING_PAGE_SIZE).toBe("number");
      expect(typeof SEASONING_IMAGE_PAGE_SIZE).toBe("number");
      expect(typeof SEASONING_TYPE_PAGE_SIZE).toBe("number");
      expect(typeof MIN_PAGE_NUMBER).toBe("number");
      expect(typeof MAX_PAGE_SIZE).toBe("number");
      expect(typeof MIN_PAGE_SIZE).toBe("number");
    });

    it("calculateOffset関数がnumber型を返すこと", () => {
      const result = calculateOffset(1, 10);
      expect(typeof result).toBe("number");
    });
  });
});
