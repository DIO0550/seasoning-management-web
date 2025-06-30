"use client";

import React from "react";
import { TextInput } from "../../elements/inputs/TextInput";
import { SubmitButton } from "../../elements/buttons/SubmitButton";
import { ErrorMessage } from "../../elements/errors/ErrorMessage";
import { useTemplateNameInput } from "../../../hooks/useTemplateNameInput";
import { useTemplateDescriptionInput } from "../../../hooks/useTemplateDescriptionInput";
import { useTemplateSeasoningSelection } from "../../../hooks/useTemplateSeasoningSelection";
import {
  useTemplateSubmit,
  TemplateFormData,
} from "../../../hooks/useTemplateSubmit";

/**
 * テンプレート追加フォームのProps
 */
type Props = {
  /** フォーム送信時のコールバック関数 */
  onSubmit?: (data: TemplateFormData) => Promise<void>;
};

/**
 * テンプレート追加フォームコンポーネント
 *
 * テンプレートの名前、説明、調味料選択を入力するためのフォームを提供します。
 * バリデーション機能付きで、入力内容の検証を行います。
 *
 * @param props - コンポーネントのプロパティ
 * @returns テンプレート追加フォームのJSX要素
 */
export const TemplateAddForm = ({ onSubmit }: Props): React.JSX.Element => {
  const templateName = useTemplateNameInput();
  const templateDescription = useTemplateDescriptionInput();
  const seasoningSelection = useTemplateSeasoningSelection();
  const { handleSubmit, isSubmitting, error } = useTemplateSubmit(onSubmit);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleSubmit({
      name: templateName.value,
      description: templateDescription.value,
      seasoningIds: seasoningSelection.selectedSeasoningIds,
    });
  };

  const isFormValid =
    templateName.isValid &&
    templateDescription.isValid &&
    seasoningSelection.isValid;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <TextInput
          id="templateName"
          name="templateName"
          label="テンプレート名"
          value={templateName.value}
          onChange={(e) => templateName.handleChange(e.target.value)}
          required
          errorMessage={templateName.error}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          説明
        </label>
        <textarea
          id="description"
          value={templateDescription.value}
          onChange={(e) => templateDescription.handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        {templateDescription.error && (
          <ErrorMessage message={templateDescription.error} />
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      <SubmitButton
        label="追加"
        disabled={!isFormValid || isSubmitting}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};
