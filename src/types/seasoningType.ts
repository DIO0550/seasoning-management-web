/**
 * 調味料の種類を表す型
 */
export interface SeasoningType {
  /** 一意識別子 */
  id: string;
  /** 調味料の種類名 */
  name: string;
  /** 作成日時 */
  createdAt?: Date;
  /** 更新日時 */
  updatedAt?: Date;
}

/**
 * 調味料の種類追加時のフォームデータ
 */
export interface SeasoningTypeFormData {
  /** 調味料の種類名 */
  name: string;
}
