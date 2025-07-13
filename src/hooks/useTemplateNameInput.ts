import { useState } from "react";
import { validateTemplateName } from "@/utils/templateNameValidation";
import { getTemplateNameValidationMessage } from "@/features/template/utils/nameValidationMessage";

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
