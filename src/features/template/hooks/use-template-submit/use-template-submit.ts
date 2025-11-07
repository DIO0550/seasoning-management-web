import { useState } from "react";
import type { SubmitErrorState } from "@/types/submitErrorState";
import { SUBMIT_ERROR_STATES } from "@/types/submitErrorState";

/**
 * テンプレート送信フォームデータの型定義
 */
export interface TemplateFormData {
  name: string;
  description: string;
  seasoningIds: string[];
}

/**
 * テンプレート送信のカスタムフック
 */
export const useTemplateSubmit = (
  onSubmit?: (data: TemplateFormData) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<SubmitErrorState>(
    SUBMIT_ERROR_STATES.NONE
  );

  const handleSubmit = async (formData: TemplateFormData) => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    setError(SUBMIT_ERROR_STATES.NONE);

    try {
      await onSubmit(formData);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NetworkError") {
          setError(SUBMIT_ERROR_STATES.NETWORK_ERROR);
        } else if (err.name === "ValidationError") {
          setError(SUBMIT_ERROR_STATES.VALIDATION_ERROR);
        } else if (err.message?.includes("Server Error")) {
          setError(SUBMIT_ERROR_STATES.SERVER_ERROR);
        } else {
          setError(SUBMIT_ERROR_STATES.UNKNOWN_ERROR);
        }
      } else {
        setError(SUBMIT_ERROR_STATES.UNKNOWN_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    handleSubmit,
  };
};
