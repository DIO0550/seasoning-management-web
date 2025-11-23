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
    format: DateFormat,
    value: string | null | undefined
  ): Date | null => {
    if (!value) {
      return null;
    }

    // フォーマット文字列を正規表現に変換
    // yyyy -> (\d{4}), MM -> (\d{2}), dd -> (\d{2})
    // その他の文字はエスケープする
    const regexPattern = format
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // 特殊文字をエスケープ
      .replace("yyyy", "(\\d{4})")
      .replace("MM", "(\\d{2})")
      .replace("dd", "(\\d{2})");

    const regex = new RegExp(`^${regexPattern}$`);
    const match = value.match(regex);

    if (!match) {
      return null;
    }

    // フォーマット内の各パーツの出現順序を特定
    const yearIndex = format.indexOf("yyyy");
    const monthIndex = format.indexOf("MM");
    const dayIndex = format.indexOf("dd");

    // 出現順序に基づいてソートし、正規表現のグループインデックスをマッピング
    const indices = [
      { type: "year", index: yearIndex },
      { type: "month", index: monthIndex },
      { type: "day", index: dayIndex },
    ]
      .filter((item) => item.index !== -1)
      .sort((a, b) => a.index - b.index);

    let year = 0;
    let month = 0;
    let day = 0;

    // マッチした結果から値を取得
    // match[0]は全体のマッチ、match[1]以降がキャプチャグループ
    indices.forEach((item, i) => {
      const val = parseInt(match[i + 1], 10);
      if (item.type === "year") year = val;
      if (item.type === "month") month = val;
      if (item.type === "day") day = val;
    });

    // 日付の妥当性チェック
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return null;
    }

    // Dateオブジェクトを作成 (UTCとして扱う)
    const date = new Date(Date.UTC(year, month - 1, day));

    // 日付の整合性チェック (例: 2月30日 -> 3月2日になっていないか)
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return null;
    }

    return date;
  },

  /**
   * Dateオブジェクトを指定されたフォーマットの文字列に変換する
   * @param format フォーマット文字列
   * @param date フォーマット対象のDateオブジェクト
   * @returns フォーマットされた文字列、またはdateがnullの場合はnull
   */
  format: (format: DateFormat, date: Date | null): string | null => {
    if (!date) {
      return null;
    }

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return format
      .replace("yyyy", String(year))
      .replace("MM", String(month).padStart(2, "0"))
      .replace("dd", String(day).padStart(2, "0"));
  },

  /**
   * 文字列が指定されたフォーマットに適合し、かつ有効な日付であるかを検証する
   * @param format フォーマット文字列
   * @param value 検証対象の文字列
   * @returns 有効な場合はtrue
   */
  isValid: (format: DateFormat, value: string): boolean => {
    return DateFormat.parse(format, value) !== null;
  },
} as const;
