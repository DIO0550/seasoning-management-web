import { TEMPLATE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

/**
 * テンプレート名のバリデーションメッセージを取得する
 * @param name - バリデーション対象のテンプレート名
 * @returns バリデーションメッセージ（エラーがない場合は空文字）
 */
export const getTemplateNameValidationMessage = (name: string): string => {
  if (name === "") return "テンプレート名は必須です。";
  if (name.length > TEMPLATE_NAME_MAX_LENGTH)
    return `テンプレート名は${TEMPLATE_NAME_MAX_LENGTH}文字以内で入力してください。`;
  return "";
};
