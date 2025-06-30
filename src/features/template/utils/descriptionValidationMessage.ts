/**
 * テンプレート説明のバリデーションメッセージを取得する
 * @param description - バリデーション対象のテンプレート説明
 * @returns バリデーションメッセージ（エラーがない場合は空文字）
 */
export const getTemplateDescriptionValidationMessage = (description: string): string => {
  if (description.length > 200) return '説明は200文字以内で入力してください。';
  return '';
};
