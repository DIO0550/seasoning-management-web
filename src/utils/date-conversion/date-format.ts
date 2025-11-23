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
   *
   * サポートされているフォーマットトークン:
   * - yyyy: 年 (4桁)
   * - MM: 月 (2桁, 01-12)
   * - dd: 日 (2桁, 01-31)
   *
   * 注意事項:
   * - 時刻フォーマット (HH:mm:ss) は現在サポートされていません。
   * - 年は 1000 ~ 9999 の範囲のみサポートしています。
   * - フォーマット内に同じトークンが複数回出現する場合、すべての値が一致する必要があります。
   *
   * @param format フォーマット文字列 (例: "yyyy-MM-dd", "yyyy/MM/dd")
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

    // フォーマット文字列をトークンで分割して正規表現を構築
    const tokenRegex = /yyyy|MM|dd/g;
    const parts = format.split(tokenRegex);
    const matches = format.match(tokenRegex);

    if (!matches) {
      return null;
    }

    let regexString = "^";
    const groupTypes: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      // 特殊文字をエスケープして追加
      regexString += parts[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (i < matches.length) {
        const token = matches[i];
        if (token === "yyyy") {
          regexString += "(\\d{4})";
          groupTypes.push("year");
        } else if (token === "MM") {
          regexString += "(\\d{2})";
          groupTypes.push("month");
        } else if (token === "dd") {
          regexString += "(\\d{2})";
          groupTypes.push("day");
        }
      }
    }
    regexString += "$";

    const regex = new RegExp(regexString);
    const match = value.match(regex);

    if (!match) {
      return null;
    }

    // 必須トークンが含まれているか確認
    if (
      !groupTypes.includes("year") ||
      !groupTypes.includes("month") ||
      !groupTypes.includes("day")
    ) {
      return null;
    }

    let year: number | null = null;
    let month: number | null = null;
    let day: number | null = null;

    // マッチした結果から値を取得し、整合性をチェック
    for (let i = 0; i < groupTypes.length; i++) {
      const val = parseInt(match[i + 1], 10);
      const type = groupTypes[i];

      if (type === "year") {
        if (year !== null && year !== val) return null;
        year = val;
      } else if (type === "month") {
        if (month !== null && month !== val) return null;
        month = val;
      } else if (type === "day") {
        if (day !== null && day !== val) return null;
        day = val;
      }
    }

    if (year === null || month === null || day === null) {
      return null;
    }

    // 年の範囲チェック
    if (year < 1000 || year > 9999) {
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
   *
   * サポートされているフォーマットトークン:
   * - yyyy: 年 (4桁)
   * - MM: 月 (2桁, 01-12)
   * - dd: 日 (2桁, 01-31)
   *
   * 注意:
   * - 単一のDateオブジェクトを指定されたフォーマットに変換します。
   * - フォーマット内に同じトークンが複数回出現する場合、すべて同じ値に置換されます。
   *
   * @param format フォーマット文字列 (例: "yyyy-MM-dd", "yyyy/MM/dd")
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
      .replaceAll("yyyy", String(year))
      .replaceAll("MM", String(month).padStart(2, "0"))
      .replaceAll("dd", String(day).padStart(2, "0"));
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
