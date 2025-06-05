import React, { useState, ChangeEvent } from 'react';
import { ErrorMessage } from '../../elements/errors/ErrorMessage';
import { TextInput } from '../../elements/inputs/TextInput';
import { SelectInput } from '../../elements/inputs/SelectInput';
import { FileInput } from '../../elements/inputs/FileInput';
import { SubmitButton } from '../../elements/buttons/SubmitButton';
import { useSeasoningNameInput } from '../../../hooks/useSeasoningNameInput';
import { useSeasoningTypeInput } from '../../../hooks/useSeasoningTypeInput';
import { useSeasoningSubmit, FormData } from '../../../hooks/useSeasoningSubmit';

// 調味料の種類を定義 - 通常はAPIから取得する
const SEASONING_TYPES = [
  { id: 'salt', name: '塩' },
  { id: 'sugar', name: '砂糖' },
  { id: 'pepper', name: '胡椒' },
  { id: 'vinegar', name: '酢' },
  { id: 'soySauce', name: '醤油' },
  { id: 'other', name: 'その他' },
];

interface SeasoningAddFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

export const SeasoningAddForm = ({ onSubmit }: SeasoningAddFormProps): React.JSX.Element => {
  // 調味料名入力用のカスタムフックを使用
  const seasoningName = useSeasoningNameInput();
  
  // 調味料の種類選択用のカスタムフックを使用
  const seasoningType = useSeasoningTypeInput();

  // フォームデータの状態（画像のみ）
  const [formData, setFormData] = useState<{image: File | null}>({
    image: null,
  });

  // 画像フィールドのバリデーション
  const validateImage = (file: File | null): string => {
    if (!file) return '';

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return 'JPEG、PNG 形式のファイルを選択してください';
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      return 'ファイルサイズは 5MB 以下にしてください';
    }

    return '';
  };

  // フォーム送信用のカスタムフック
  const { submit, isSubmitting, errors, isFormValid, setImageError } = useSeasoningSubmit(
    seasoningName,
    seasoningType,
    formData,
    onSubmit,
    () => setFormData({ image: null }) // リセット時にフォームデータをクリア
  );

  // ファイル入力変更の処理
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    setFormData(prev => ({
      ...prev,
      image: file
    }));

    // 画像のバリデーションとエラー設定
    const validationError = validateImage(file);
    setImageError(validationError);
  };

  return (
    <div className="space-y-4">
      {/* 全般的なエラーメッセージ */}
      {errors.general && <ErrorMessage message={errors.general} />}
      
      {/* 名前フィールド */}
      <TextInput 
        id="name"
        name="name"
        label="調味料"
        value={seasoningName.value}
        onChange={seasoningName.onChange}
        onBlur={seasoningName.onBlur}
        placeholder="調味料名を入力"
        maxLength={20}
        required={true}
        errorMessage={seasoningName.error}
      />
      
      {/* 種類フィールド */}
      <SelectInput 
        id="type"
        name="type"
        label="調味料の種類"
        value={seasoningType.value}
        onChange={seasoningType.onChange}
        onBlur={seasoningType.onBlur}
        options={SEASONING_TYPES}
        required={true}
        errorMessage={seasoningType.error}
      />
      
      {/* 画像フィールド */}
      <FileInput 
        id="image"
        name="image"
        label="調味料の画像"
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        errorMessage={errors.image}
        helperText="JPEG または PNG 形式、5MB以下"
      />
      
      {/* 送信ボタン */}
      <div className="pt-4">
        <SubmitButton 
          label="追加"
          loadingLabel="追加中..."
          isSubmitting={isSubmitting}
          disabled={!isFormValid}
          onClick={submit}
        />
      </div>
    </div>
  );
};