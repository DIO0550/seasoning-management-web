import { TEMPLATE_DESCRIPTION_MAX_LENGTH } from "@/constants/validation/description-validation";

/**
 * テンプレート説明のバリデーションを行う
 * @param description - バリデーション対象のテンプレート説明
 * @returns バリデーション結果（true: 有効, false: 無効）
 */
export const validateTemplateDescription = (description: string): boolean => {
  if (description.length <= TEMPLATE_DESCRIPTION_MAX_LENGTH) return true;
  return false;
};
