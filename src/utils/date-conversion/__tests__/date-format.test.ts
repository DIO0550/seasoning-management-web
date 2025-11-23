import { describe, test, expect } from "vitest";
import { DateFormat } from "@/utils/date-conversion/date-format";

describe("DateFormat", () => {
  describe("標準フォーマット定義", () => {
    test("Standardフォーマットが正しい形式であること", () => {
      expect(DateFormat.Standard).toBe("yyyy-MM-dd");
    });

    test("Shortフォーマットが正しい形式であること", () => {
      expect(DateFormat.Short).toBe("yyyy/MM/dd");
    });

    test("Mediumフォーマットが正しい形式であること", () => {
      expect(DateFormat.Medium).toBe("yyyy年MM月dd日");
    });

    test("Fullフォーマットが正しい形式であること", () => {
      expect(DateFormat.Full).toBe("yyyy年MM月dd日 HH:mm:ss");
    });
  });

  describe("of関数", () => {
    test("任意のパターンをDateFormatとして生成できること", () => {
      const pattern = "yyyy.MM.dd";
      expect(DateFormat.of(pattern)).toBe(pattern);
    });
  });
});
