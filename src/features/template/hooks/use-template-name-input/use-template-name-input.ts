import { useState } from "react";
import { validateTemplateName } from "@/utils/template-name-validation/template-name-validation";
import { getTemplateNameValidationMessage } from "@/features/template/utils";

/**
 * テンプレート名入力のカスタムフック
 */
export const useTemplateNameInput = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const errorMessage = getTemplateNameValidationMessage(newValue);
    setError(errorMessage);
  };

  const isValid = validateTemplateName(value);

  return {
    value,
    error,
    isValid,
    handleChange,
  };
};
