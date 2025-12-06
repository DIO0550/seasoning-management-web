import React from "react";
import { TextInput } from "@/components/elements/inputs/TextInput";
import { Button } from "@/components/elements/buttons/button";
import { useSeasoningTypeAdd } from "@/features/seasoning/hooks";
import {
  getSeasoningTypeSubmitMessage,
  getSeasoningTypeValidationMessage,
} from "@/features/seasoning/utils";
import type { SeasoningType } from "@/types/seasoning";

type SeasoningTypeAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (seasoningType: SeasoningType) => void;
};

export const SeasoningTypeAddModal = ({
  isOpen,
  onClose,
  onAdded,
}: SeasoningTypeAddModalProps): React.JSX.Element | null => {
  const {
    name,
    error,
    submitError,
    isSubmitting,
    isFormValid,
    onBlur,
    onChange,
    submit,
    reset,
  } = useSeasoningTypeAdd(async (data) => {
    const response = await fetch("/api/seasoning-types", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        body?.message ?? (response.status >= 500 ? "Server Error" : "");
      const errorInstance = new Error(
        errorMessage || "調味料の種類の追加に失敗しました"
      );
      errorInstance.name =
        response.status >= 500 ? "NetworkError" : "ValidationError";
      throw errorInstance;
    }

    onAdded(body.data);
  }, onClose);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            調味料の種類を追加
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <TextInput
            id="seasoning-type-name"
            name="seasoning-type-name"
            label="調味料の種類名"
            value={name}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="例）液体調味料"
            maxLength={50}
            required={true}
            errorMessage={getSeasoningTypeValidationMessage(error)}
          />

          {getSeasoningTypeSubmitMessage(submitError) ? (
            <p className="text-sm text-red-600">
              {getSeasoningTypeSubmitMessage(submitError)}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="min-w-[96px]"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={submit}
              disabled={isSubmitting}
              className="min-w-[96px]"
            >
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
