import { TEMPLATE_DESCRIPTION_MAX_LENGTH } from "@/constants/validation/description-validation";

/**
 * テンプレート説明のバリデーションメッセージを取得する
 * @param description - バリデーション対象のテンプレート説明
 * @returns バリデーションメッセージ（エラーがない場合は空文字）
 */
export const getTemplateDescriptionValidationMessage = (
  description: string
): string => {
  if (description.length > TEMPLATE_DESCRIPTION_MAX_LENGTH)
    return `説明は${TEMPLATE_DESCRIPTION_MAX_LENGTH}文字以内で入力してください。`;
  return "";
};
