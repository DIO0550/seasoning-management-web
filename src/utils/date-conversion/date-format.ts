/**
 * 日付フォーマットを表す型
 */
export type DateFormat = string;

/**
 * DateFormatのコンパニオンオブジェクト
 * 標準的なフォーマット定義とヘルパー関数を提供する
 */
export const DateFormat = {
  /** 標準形式: yyyy-MM-dd */
  Standard: "yyyy-MM-dd",
  /** 短縮形式: yyyy/MM/dd */
  Short: "yyyy/MM/dd",
  /** 日本語形式（中）: yyyy年MM月dd日 */
  Medium: "yyyy年MM月dd日",
  /** 日本語形式（長）: yyyy年MM月dd日 HH:mm:ss */
  Full: "yyyy年MM月dd日 HH:mm:ss",

  /**
   * 任意の文字列からDateFormatを作成するヘルパー関数
   * @param pattern フォーマットパターン
   * @returns DateFormat
   */
  of: (pattern: string): DateFormat => pattern,
} as const;
