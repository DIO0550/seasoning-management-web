import { useState, useCallback, useMemo, ChangeEvent, FocusEvent } from "react";
import {
  validateSeasoningTypeName,
  type SeasoningTypeNameValidationError,
} from "../utils/seasoningTypeNameValidation";
import type { SeasoningTypeFormData } from "../types/seasoningType";
import type { ValidationErrorState } from "../types/validationErrorState";
import { VALIDATION_ERROR_STATES } from "../types/validationErrorState";
import type { SubmitErrorState } from "../types/submitErrorState";
import { SUBMIT_ERROR_STATES } from "../types/submitErrorState";

// エラーハンドリング用の定数
const ERROR_NAMES = {
  NETWORK: "NetworkError",
  VALIDATION: "ValidationError",
} as const;

const ERROR_MESSAGES = {
  SERVER: "Server Error",
} as const;

export interface UseSeasoningTypeAddReturn {
  /** 調味料の種類名 */
  name: string;
  /** バリデーションエラー状態 */
  error: ValidationErrorState;
  /** 送信エラー状態 */
  submitError: SubmitErrorState;
  /** 送信中フラグ */
  isSubmitting: boolean;
  /** フォーム有効性フラグ */
  isFormValid: boolean;
  /** 入力変更ハンドラー */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** フォーカスアウトハンドラー */
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  /** 送信処理 */
  submit: () => Promise<void>;
  /** リセット処理 */
  reset: () => void;
}

/**
 * エラーオブジェクトから適切なSubmitErrorStateを決定する
 */
const determineSubmitErrorState = (error: unknown): SubmitErrorState => {
  if (!(error instanceof Error)) {
    return SUBMIT_ERROR_STATES.UNKNOWN_ERROR;
  }

  if (error.name === ERROR_NAMES.NETWORK) {
    return SUBMIT_ERROR_STATES.NETWORK_ERROR;
  }

  if (error.name === ERROR_NAMES.VALIDATION) {
    return SUBMIT_ERROR_STATES.VALIDATION_ERROR;
  }

  if (error.message?.includes(ERROR_MESSAGES.SERVER)) {
    return SUBMIT_ERROR_STATES.SERVER_ERROR;
  }

  return SUBMIT_ERROR_STATES.UNKNOWN_ERROR;
};
const convertValidationErrorToState = (
  error: SeasoningTypeNameValidationError
): ValidationErrorState => {
  switch (error) {
    case "REQUIRED":
      return VALIDATION_ERROR_STATES.REQUIRED;
    case "LENGTH_EXCEEDED":
      return VALIDATION_ERROR_STATES.TOO_LONG;
    case "NONE":
    default:
      return VALIDATION_ERROR_STATES.NONE;
  }
};

/**
 * 調味料の種類追加を管理するカスタムフック
 * バリデーション、送信処理、エラー処理を行う
 * エラーメッセージの文字列はコンポーネント側が責務を持つ
 *
 * @param onSubmit - 送信時のコールバック関数
 * @param onSuccess - 送信成功時のコールバック関数
 * @returns フック戻り値
 */
export const useSeasoningTypeAdd = (
  onSubmit?: (data: SeasoningTypeFormData) => Promise<void>,
  onSuccess?: () => void
): UseSeasoningTypeAddReturn => {
  const [name, setName] = useState("");
  const [error, setError] = useState<ValidationErrorState>(
    VALIDATION_ERROR_STATES.NONE
  );
  const [submitError, setSubmitError] = useState<SubmitErrorState>(
    SUBMIT_ERROR_STATES.NONE
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム有効性をメモ化して計算
  const isFormValid = useMemo((): boolean => {
    const trimmedName = name.trim();
    const validationError = validateSeasoningTypeName(trimmedName);
    return trimmedName !== "" && validationError === "NONE";
  }, [name]);

  // 入力変更ハンドラー
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);

    // リアルタイムバリデーション（文字数制限のみ）
    const validationError = validateSeasoningTypeName(newValue.trim());
    if (validationError === "LENGTH_EXCEEDED") {
      setError(convertValidationErrorToState(validationError));
    } else {
      setError(VALIDATION_ERROR_STATES.NONE);
    }
  }, []);

  // フォーカスアウトハンドラー
  const onBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value.trim();
    const validationError = validateSeasoningTypeName(currentValue);
    setError(convertValidationErrorToState(validationError));
  }, []);

  // 送信処理
  const submit = useCallback(async (): Promise<void> => {
    // ガード節: onSubmitが未定義の場合は早期リターン
    if (!onSubmit) {
      return;
    }

    const trimmedName = name.trim();
    const validationError = validateSeasoningTypeName(trimmedName);

    // ガード節: バリデーションエラーがある場合は早期リターン
    if (validationError !== "NONE") {
      setError(convertValidationErrorToState(validationError));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(VALIDATION_ERROR_STATES.NONE);
      setSubmitError(SUBMIT_ERROR_STATES.NONE);

      await onSubmit({
        name: trimmedName,
      });

      // 送信成功時にフォームをリセット
      setName("");
      setError(VALIDATION_ERROR_STATES.NONE);
      setSubmitError(SUBMIT_ERROR_STATES.NONE);
      onSuccess?.();
    } catch (error) {
      setSubmitError(determineSubmitErrorState(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [name, onSubmit, onSuccess]);

  // リセット処理
  const reset = useCallback(() => {
    setName("");
    setError(VALIDATION_ERROR_STATES.NONE);
    setSubmitError(SUBMIT_ERROR_STATES.NONE);
  }, []);

  return {
    name,
    error,
    submitError,
    isSubmitting,
    isFormValid: isFormValid,
    onChange,
    onBlur,
    submit,
    reset,
  };
};
