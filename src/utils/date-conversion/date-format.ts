/**
 * 日付フォーマットを表す型
 */
export type DateFormat = string;

const Constants = {
  /** 標準形式: yyyy-MM-dd */
  Standard: "yyyy-MM-dd",
  /** 短縮形式: yyyy/MM/dd */
  Short: "yyyy/MM/dd",
  /** 日本語形式（中）: yyyy年MM月dd日 */
  Medium: "yyyy年MM月dd日",
  /** 日本語形式（長）: yyyy年MM月dd日 HH:mm:ss */
  Full: "yyyy年MM月dd日 HH:mm:ss",
} as const;

/**
 * DateFormatのコンパニオンオブジェクト
 * 標準的なフォーマット定義とヘルパー関数を提供する
 */
export const DateFormat = {
  ...Constants,
  /**
   * 任意の文字列からDateFormatを作成するヘルパー関数
   * @param pattern フォーマットパターン
   * @returns DateFormat
   */
  of: (pattern: string): DateFormat => pattern,

  /**
   * 指定されたフォーマットに従って文字列をパースし、Dateオブジェクトを返す
   * @param format フォーマット文字列
   * @param value パース対象の文字列
   * @returns Dateオブジェクト、または無効な場合はnull
   */
  parse: (
    _format: DateFormat,
    _value: string | null | undefined
  ): Date | null => {
    throw new Error("Not implemented");
  },

  /**
   * Dateオブジェクトを指定されたフォーマットの文字列に変換する
   * @param format フォーマット文字列
   * @param date フォーマット対象のDateオブジェクト
   * @returns フォーマットされた文字列、またはdateがnullの場合はnull
   */
  format: (_format: DateFormat, _date: Date | null): string | null => {
    throw new Error("Not implemented");
  },

  /**
   * 文字列が指定されたフォーマットに適合し、かつ有効な日付であるかを検証する
   * @param format フォーマット文字列
   * @param value 検証対象の文字列
   * @returns 有効な場合はtrue
   */
  isValid: (_format: DateFormat, _value: string): boolean => {
    throw new Error("Not implemented");
  },
} as const;
