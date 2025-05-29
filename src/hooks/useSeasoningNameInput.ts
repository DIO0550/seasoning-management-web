import { useState, ChangeEvent, FocusEvent } from 'react';

export interface UseSeasoningNameInputReturn {
  value: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  reset: () => void;
}

/**
 * 調味料名入力フィールドを管理するカスタムフック
 * バリデーション、状態管理、イベントハンドラーを処理する
 */
export const useSeasoningNameInput = (): UseSeasoningNameInputReturn => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // 名前フィールドのバリデーション - SeasoningAddFormから抽出
  const validateName = (name: string): string => {
    if (!name) {
      return '調味料名は必須です';
    }
    if (name.length > 20) {
      return '調味料名は 20 文字以内で入力してください';
    }
    // 名前が半角英数字のみかチェック
    if (!/^[a-zA-Z0-9]*$/.test(name)) {
      return '調味料名は半角英数字で入力してください';
    }
    
    // 重複チェックについては、通常はAPIに対してチェックする
    // これはその機能のプレースホルダー
    // 実際の実装では、これはAPIへの非同期呼び出しになる
    
    return '';
  };

  // 入力変更の処理
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 変更時にフィールドをバリデーション
    const validationError = validateName(newValue);
    setError(validationError);
  };

  // バリデーションのためのブラーイベントの処理
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    
    // ブラー時にフィールドをバリデーション
    const validationError = validateName(currentValue);
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