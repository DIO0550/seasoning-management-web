import { TEMPLATE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

/**
 * テンプレート名のバリデーションを行う
 * @param name - バリデーション対象のテンプレート名
 * @returns バリデーション結果（true: 有効, false: 無効）
 */
export const validateTemplateName = (name: string): boolean => {
  if (name.length === 0) return false;
  if (name.length > TEMPLATE_NAME_MAX_LENGTH) return false;
  return true;
};
