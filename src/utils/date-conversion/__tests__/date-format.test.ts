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

test("DateFormat.parse: 標準フォーマット(yyyy-MM-dd)の文字列を正しくパースできること", () => {
  const result = DateFormat.parse(DateFormat.Standard, "2023-11-23");
  expect(result).not.toBeNull();
  expect(result?.getUTCFullYear()).toBe(2023);
  expect(result?.getUTCMonth()).toBe(10); // 11月 (0-indexed)
  expect(result?.getUTCDate()).toBe(23);
});

test("DateFormat.parse: カスタムフォーマット(yyyy/MM/dd)の文字列を正しくパースできること", () => {
  const result = DateFormat.parse(DateFormat.Short, "2023/11/23");
  expect(result).not.toBeNull();
  expect(result?.getUTCFullYear()).toBe(2023);
  expect(result?.getUTCMonth()).toBe(10);
  expect(result?.getUTCDate()).toBe(23);
});

test("DateFormat.parse: 日本語フォーマット(yyyy年MM月dd日)の文字列を正しくパースできること", () => {
  const result = DateFormat.parse(DateFormat.Medium, "2023年11月23日");
  expect(result).not.toBeNull();
  expect(result?.getUTCFullYear()).toBe(2023);
  expect(result?.getUTCMonth()).toBe(10);
  expect(result?.getUTCDate()).toBe(23);
});

test("DateFormat.parse: 不正な日付文字列の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "invalid-date")).toBeNull();
  expect(DateFormat.parse(DateFormat.Standard, "2023-13-01")).toBeNull(); // 月が不正
  expect(DateFormat.parse(DateFormat.Standard, "2023-11-32")).toBeNull(); // 日が不正
});

test("DateFormat.parse: フォーマットと一致しない文字列の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "2023/11/23")).toBeNull();
});

test("DateFormat.parse: 入力がnullまたはundefinedの場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, null)).toBeNull();
  expect(DateFormat.parse(DateFormat.Standard, undefined)).toBeNull();
});

test("DateFormat.parse: 繰り返しトークンを含むフォーマットを正しくパースできること", () => {
  const format = DateFormat.of("yyyy-MM-dd (yyyy/MM/dd)");
  const result = DateFormat.parse(format, "2023-11-23 (2023/11/23)");
  expect(result).not.toBeNull();
  expect(result?.getUTCFullYear()).toBe(2023);
  expect(result?.getUTCMonth()).toBe(10);
  expect(result?.getUTCDate()).toBe(23);
});

test("DateFormat.parse: 必須トークンが欠けているフォーマットの場合はnullを返すこと", () => {
  const format = DateFormat.of("yyyy-MM");
  expect(DateFormat.parse(format, "2023-11")).toBeNull();
});

test("DateFormat.format: Dateオブジェクトを標準フォーマット(yyyy-MM-dd)に変換できること", () => {
  const date = new Date(Date.UTC(2023, 10, 23)); // 2023-11-23 UTC
  expect(DateFormat.format(DateFormat.Standard, date)).toBe("2023-11-23");
});

test("DateFormat.format: Dateオブジェクトをカスタムフォーマット(yyyy/MM/dd)に変換できること", () => {
  const date = new Date(Date.UTC(2023, 10, 23));
  expect(DateFormat.format(DateFormat.Short, date)).toBe("2023/11/23");
});

test("DateFormat.format: Dateオブジェクトを日本語フォーマット(yyyy年MM月dd日)に変換できること", () => {
  const date = new Date(Date.UTC(2023, 10, 23));
  expect(DateFormat.format(DateFormat.Medium, date)).toBe("2023年11月23日");
});

test("DateFormat.format: 入力がnullの場合はnullを返すこと", () => {
  expect(DateFormat.format(DateFormat.Standard, null)).toBeNull();
});

test("DateFormat.format: 繰り返しトークンを含むフォーマットに正しく変換できること", () => {
  const date = new Date(Date.UTC(2023, 10, 23));
  const format = DateFormat.of("yyyy-MM-dd (yyyy/MM/dd)");
  expect(DateFormat.format(format, date)).toBe("2023-11-23 (2023/11/23)");
});

test("DateFormat.format: 年が1000未満の場合はnullを返すこと", () => {
  const date = new Date(Date.UTC(123, 0, 1)); // 年が範囲外
  expect(DateFormat.format(DateFormat.Standard, date)).toBeNull();
});

test("DateFormat.format: 年が10000以上の場合はnullを返すこと", () => {
  const date = new Date(Date.UTC(10000, 0, 1)); // 年が範囲外
  expect(DateFormat.format(DateFormat.Standard, date)).toBeNull();
});

test("DateFormat.isValid: 有効な日付文字列とフォーマットの場合はtrueを返すこと", () => {
  expect(DateFormat.isValid(DateFormat.Standard, "2023-11-23")).toBe(true);
  expect(DateFormat.isValid(DateFormat.Short, "2023/11/23")).toBe(true);
});

test("DateFormat.isValid: 無効な日付文字列の場合はfalseを返すこと", () => {
  expect(DateFormat.isValid(DateFormat.Standard, "invalid-date")).toBe(false);
  expect(DateFormat.isValid(DateFormat.Standard, "2023-13-01")).toBe(false);
  expect(DateFormat.isValid(DateFormat.Standard, "2023-11-32")).toBe(false);
});

test("DateFormat.isValid: フォーマットと一致しない場合はfalseを返すこと", () => {
  expect(DateFormat.isValid(DateFormat.Standard, "2023/11/23")).toBe(false);
});

test("DateFormat.parse: 繰り返しトークンの値が不一致の場合はnullを返すこと", () => {
  const format = DateFormat.of("yyyy-MM-dd (yyyy/MM/dd)");
  expect(DateFormat.parse(format, "2023-11-23 (2024/11/23)")).toBeNull();
  expect(DateFormat.parse(format, "2023-11-23 (2023/12/23)")).toBeNull();
  expect(DateFormat.parse(format, "2023-11-23 (2023/11/24)")).toBeNull();
});

test("DateFormat.parse: 年が1000未満の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "0999-01-01")).toBeNull();
  expect(DateFormat.parse(DateFormat.Standard, "0001-01-01")).toBeNull();
});

test("DateFormat.parse: 年が1000の場合は正しくパースできること", () => {
  const result = DateFormat.parse(DateFormat.Standard, "1000-01-01");
  expect(result).not.toBeNull();
  expect(result?.getUTCFullYear()).toBe(1000);
});

test("DateFormat.parse: 年が9999の場合は正しくパースできること", () => {
  const result = DateFormat.parse(DateFormat.Standard, "9999-12-31");
  expect(result).not.toBeNull();
  expect(result?.getUTCFullYear()).toBe(9999);
});

test("DateFormat.parse: 存在しない日付(うるう年以外)の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "2023-02-29")).toBeNull();
});

test("DateFormat.parse: 月が00の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "2023-00-15")).toBeNull();
});

test("DateFormat.parse: 月が13以上の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "2023-13-01")).toBeNull();
});

test("DateFormat.parse: 日が00の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "2023-01-00")).toBeNull();
});

test("DateFormat.parse: 日が32以上の場合はnullを返すこと", () => {
  expect(DateFormat.parse(DateFormat.Standard, "2023-01-32")).toBeNull();
});

test("DateFormat.parse: うるう年の2月29日は正しくパースできること", () => {
  const result = DateFormat.parse(DateFormat.Standard, "2024-02-29");
  expect(result).not.toBeNull();
  expect(result?.getUTCFullYear()).toBe(2024);
  expect(result?.getUTCMonth()).toBe(1);
  expect(result?.getUTCDate()).toBe(29);
});
