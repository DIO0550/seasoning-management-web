/**
 * フォームフィールド情報の型定義
 */
export interface FormField {
  value: string;
  error: string;
}

/**
 * フォームエラー情報の型定義
 */
export interface FormErrors {
  image: string;
  general: string;
}

/**
 * 必須フィールドがすべて入力されているかをチェック
 */
export const hasAllRequiredFields = (fields: FormField[]): boolean => {
  return fields.every((field) => Boolean(field.value));
};

/**
 * フォームにエラーがないかをチェック
 */
export const hasAnyFormErrors = (
  fields: FormField[],
  errors: FormErrors
): boolean => {
  const fieldErrors = fields.map((field) => field.error);
  const allErrors = [...fieldErrors, errors.image, errors.general];

  return allErrors.some((error) => Boolean(error));
};

/**
 * フォームが送信可能な状態かをチェック
 */
export const canSubmit = (fields: FormField[], errors: FormErrors): boolean => {
  const requiredFieldsFilled = hasAllRequiredFields(fields);
  const noErrors = !hasAnyFormErrors(fields, errors);

  return requiredFieldsFilled && noErrors;
};
