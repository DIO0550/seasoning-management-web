import { DateFormat } from "./date-format";

/**
 * YYYY-MM-DD形式の日付文字列をUTC Dateオブジェクトに変換する
 * @param value - YYYY-MM-DD形式の日付文字列
 * @returns UTC Dateオブジェクト、またはnull
 * @throws 無効な日付形式の場合にErrorをスローします
 */
export const stringToUtcDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const date = DateFormat.parse(DateFormat.Standard, value);

  if (!date) {
    throw new Error(`無効な日付形式です: ${value}`);
  }

  return date;
};

/**
 * UTC DateオブジェクトをYYYY-MM-DD形式の文字列に変換する
 * @param value - UTC Dateオブジェクト
 * @returns YYYY-MM-DD形式の文字列、またはnull
 */
export const utcDateToString = (value: Date | null): string | null => {
  return DateFormat.format(DateFormat.Standard, value);
};

/**
 * YYYY-MM-DD形式の日付文字列が有効かを検証する
 * @param value - YYYY-MM-DD形式の日付文字列
 * @returns 有効な日付の場合true、無効な場合false
 */
export const isValidDateString = (value: string): boolean => {
  return DateFormat.isValid(DateFormat.Standard, value);
};
