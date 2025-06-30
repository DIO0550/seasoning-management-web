/**
 * テンプレート名の最大文字数
 */
const MAX_TEMPLATE_NAME_LENGTH = 20;

/**
 * テンプレート名のバリデーションを行う
 * @param name - バリデーション対象のテンプレート名
 * @returns バリデーション結果（true: 有効, false: 無効）
 */
export const validateTemplateName = (name: string): boolean => {
  if (name.length === 0) return false;
  if (name.length > MAX_TEMPLATE_NAME_LENGTH) return false;
  return true;
};
