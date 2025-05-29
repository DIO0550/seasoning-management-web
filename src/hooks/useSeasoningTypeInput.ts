import { useState, ChangeEvent, FocusEvent } from 'react';

export interface UseSeasoningTypeInputReturn {
  value: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: FocusEvent<HTMLSelectElement>) => void;
  reset: () => void;
}

/**
 * 調味料の種類選択フィールドを管理するカスタムフック
 * バリデーション、状態管理、イベントハンドラーを処理する
 */
export const useSeasoningTypeInput = (): UseSeasoningTypeInputReturn => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // 種類フィールドのバリデーション - SeasoningAddFormから抽出
  const validateType = (type: string): string => {
    if (!type) {
      return '調味料の種類を選択してください';
    }
    return '';
  };

  // 入力変更の処理
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 変更時にフィールドをバリデーション
    const validationError = validateType(newValue);
    setError(validationError);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLSelectElement>) => {
    const currentValue = e.target.value;
    
    // ブラー時にフィールドをバリデーション
    const validationError = validateType(currentValue);
    setError(validationError);
  };

  // 値とエラーをクリアするリセット関数
  const reset = () => {
    setValue('');
    setError('');
  };

  return {
    value,
    error,
    onChange,
    onBlur,
    reset,
  };
};