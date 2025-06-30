import { useState } from "react";

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
  const [error, setError] = useState("");

  const handleSubmit = async (formData: TemplateFormData) => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
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
