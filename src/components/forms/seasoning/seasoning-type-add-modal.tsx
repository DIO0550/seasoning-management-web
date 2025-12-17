import React, { useCallback, useEffect, useRef } from "react";
import { TextInput } from "@/components/elements/inputs/TextInput";
import { Button } from "@/components/elements/buttons/button";
import { useSeasoningTypeAdd } from "@/features/seasoning/hooks";
import {
  getSeasoningTypeSubmitMessage,
  getSeasoningTypeValidationMessage,
} from "@/features/seasoning/utils";
import type { SeasoningType } from "@/types/seasoning";
import { SEASONING_TYPE_NAME_MAX_LENGTH } from "@/constants/validation/nameValidation";

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
  const modalRef = useRef<HTMLDivElement | null>(null);
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
        body?.message ??
        (response.status >= 500
          ? "サーバーエラーが発生しました"
          : "調味料の種類の追加に失敗しました");
      const errorInstance = new Error(errorMessage);
      errorInstance.name =
        response.status >= 500 ? "NetworkError" : "ValidationError";
      throw errorInstance;
    }

    if (!body?.data) {
      throw new Error("調味料の種類の追加に失敗しました");
    }

    onAdded(body.data);
  }, onClose);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusFirstElement = () => {
      const explicitTarget = document.getElementById(
        "seasoning-type-name"
      ) as HTMLElement | null;
      if (explicitTarget) {
        explicitTarget.focus();
        return;
      }
      const modalElement = modalRef.current;
      const firstFocusable =
        modalElement?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modalElement = modalRef.current;
      if (!modalElement) {
        return;
      }

      const focusableElements = Array.from(
        modalElement.querySelectorAll<HTMLElement>(focusableSelector)
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement || !modalElement.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (activeElement === lastElement || !modalElement.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    focusFirstElement();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previousActiveElement?.focus?.();
    };
  }, [handleClose, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      data-testid="seasoning-type-add-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
      >
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900">
            調味料の種類を追加
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="閉じる"
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              ×
            </span>
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
            maxLength={SEASONING_TYPE_NAME_MAX_LENGTH}
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
              disabled={isSubmitting || !isFormValid}
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
