import { test, expect } from "vitest";
import { DateFormat } from "@/utils/date-conversion";

test("DateFormat: 標準フォーマット定義: Standardフォーマットが正しい形式であること", () => {
  expect(DateFormat.Standard).toBe("yyyy-MM-dd");
});

test("DateFormat: 標準フォーマット定義: Shortフォーマットが正しい形式であること", () => {
  expect(DateFormat.Short).toBe("yyyy/MM/dd");
});

test("DateFormat: 標準フォーマット定義: Mediumフォーマットが正しい形式であること", () => {
  expect(DateFormat.Medium).toBe("yyyy年MM月dd日");
});

test("DateFormat: 標準フォーマット定義: Fullフォーマットが正しい形式であること", () => {
  expect(DateFormat.Full).toBe("yyyy年MM月dd日 HH:mm:ss");
});

test("DateFormat: of関数: 任意のパターンをDateFormatとして生成できること", () => {
  const pattern = "yyyy.MM.dd";
  expect(DateFormat.of(pattern)).toBe(pattern);
});
