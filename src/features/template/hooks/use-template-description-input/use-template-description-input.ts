import { useState } from "react";
import { validateTemplateDescription } from "@/utils/template-description-validation/template-description-validation";
import { getTemplateDescriptionValidationMessage } from "@/features/template/utils";

/**
 * テンプレート説明入力のカスタムフック
 */
export const useTemplateDescriptionInput = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const errorMessage = getTemplateDescriptionValidationMessage(newValue);
    setError(errorMessage);
  };

  const isValid = validateTemplateDescription(value);

  return {
    value,
    error,
    isValid,
    handleChange,
  };
};
