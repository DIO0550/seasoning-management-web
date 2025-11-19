/**
 * YYYY-MM-DD形式の日付文字列を検証して分解する
 * @param value - YYYY-MM-DD形式の日付文字列
 * @returns 検証結果と年月日のタプル [有効性, 年, 月, 日]
 */
const validateAndParseDateString = (
  value: string
): [boolean, number, number, number] => {
  if (!value || value.trim() === "") {
    return [false, 0, 0, 0];
  }

  const parts = value.split("-").map(Number);
  if (parts.length !== 3) {
    return [false, 0, 0, 0];
  }

  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, month - 1, day));

  const isValid =
    !Number.isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day;

  return [isValid, year, month, day];
};

/**
 * YYYY-MM-DD形式の日付文字列をUTC Dateオブジェクトに変換する
 * @param value - YYYY-MM-DD形式の日付文字列
 * @returns UTC Dateオブジェクト、またはnull
 * @throws {Error} 無効な日付形式の場合
 */
export const stringToUtcDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const [isValid, year, month, day] = validateAndParseDateString(value);

  if (!isValid) {
    throw new Error(`無効な日付形式です: ${value}`);
  }

  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * UTC DateオブジェクトをYYYY-MM-DD形式の文字列に変換する
 * @param value - UTC Dateオブジェクト
 * @returns YYYY-MM-DD形式の文字列、またはnull
 */
export const utcDateToString = (value: Date | null): string | null => {
  if (!value) {
    return null;
  }

  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD形式の日付文字列が有効かを検証する
 * @param value - YYYY-MM-DD形式の日付文字列
 * @returns 有効な日付の場合true、無効な場合false
 */
export const isValidDateString = (value: string): boolean => {
  const [isValid] = validateAndParseDateString(value);
  return isValid;
};
