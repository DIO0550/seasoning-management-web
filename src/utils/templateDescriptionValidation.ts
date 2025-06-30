/**
 * テンプレート説明の最大文字数
 */
const MAX_TEMPLATE_DESCRIPTION_LENGTH = 200;

/**
 * テンプレート説明のバリデーションを行う
 * @param description - バリデーション対象のテンプレート説明
 * @returns バリデーション結果（true: 有効, false: 無効）
 */
export const validateTemplateDescription = (description: string): boolean => {
  if (description.length <= MAX_TEMPLATE_DESCRIPTION_LENGTH) return true;
  return false;
};
