import { describe, expect, test } from "vitest";
import {
  stringToUtcDate,
  utcDateToString,
  isValidDateString,
} from "../date-conversion";

describe("stringToUtcDate", () => {
  test("有効な日付文字列をUTC Dateに変換する", () => {
    const result = stringToUtcDate("2025-12-01");
    expect(result).toEqual(new Date(Date.UTC(2025, 11, 1)));
  });

  test("null/undefinedの場合はnullを返す", () => {
    expect(stringToUtcDate(null)).toBeNull();
    expect(stringToUtcDate(undefined)).toBeNull();
  });

  test("無効な日付形式の場合はエラーを投げる", () => {
    expect(() => stringToUtcDate("2025-13-01")).toThrow("無効な日付形式です");
    expect(() => stringToUtcDate("2025-02-30")).toThrow("無効な日付形式です");
    expect(() => stringToUtcDate("invalid")).toThrow("無効な日付形式です");
  });
});

describe("utcDateToString", () => {
  test("UTC DateをYYYY-MM-DD形式に変換する", () => {
    const date = new Date(Date.UTC(2025, 11, 1));
    expect(utcDateToString(date)).toBe("2025-12-01");
  });

  test("nullの場合はnullを返す", () => {
    expect(utcDateToString(null)).toBeNull();
  });

  test("月と日が1桁の場合はゼロ埋めする", () => {
    const date = new Date(Date.UTC(2025, 0, 5));
    expect(utcDateToString(date)).toBe("2025-01-05");
  });
});

describe("isValidDateString", () => {
  test("有効な日付文字列の場合はtrueを返す", () => {
    expect(isValidDateString("2025-12-01")).toBe(true);
    expect(isValidDateString("2025-01-31")).toBe(true);
  });

  test("無効な日付文字列の場合はfalseを返す", () => {
    expect(isValidDateString("2025-13-01")).toBe(false);
    expect(isValidDateString("2025-02-30")).toBe(false);
    expect(isValidDateString("invalid")).toBe(false);
    expect(isValidDateString("2025/12/01")).toBe(false);
  });
});
