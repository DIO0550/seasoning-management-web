/**
 * テンプレート名のバリデーションメッセージを取得する
 * @param name - バリデーション対象のテンプレート名
 * @returns バリデーションメッセージ（エラーがない場合は空文字）
 */
export const getTemplateNameValidationMessage = (name: string): string => {
  if (name === "") return "テンプレート名は必須です。";
  if (name.length > 20) return "テンプレート名は20文字以内で入力してください。";
  return "";
};
