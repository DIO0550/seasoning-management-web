import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ErrorMessage } from "@/components/elements/errors/ErrorMessage";
import { TextInput } from "@/components/elements/inputs/TextInput";
import { SelectInput } from "@/components/elements/inputs/SelectInput";
import { FileInput } from "@/components/elements/inputs/FileInput";
import { SubmitButton } from "@/components/elements/buttons/SubmitButton";
import { Button } from "@/components/elements/buttons/button";
import { useSeasoningNameInput } from "@/features/seasoning/hooks";
import { useSeasoningTypeInput } from "@/features/seasoning/hooks";
import { useSeasoningImageInput } from "@/features/seasoning/hooks";
import { useSeasoningSubmit, FormData } from "@/features/seasoning/hooks";
import { VALIDATION_CONSTANTS } from "@/constants/validation";
import { SeasoningTypeAddModal } from "./SeasoningTypeAddModal";
import type { SeasoningType } from "@/types/seasoning";

/**
 * 調味料追加フォームのProps
 */
type Props = {
  /** フォーム送信時のコールバック関数 */
  onSubmit?: (data: FormData) => Promise<void>;
};

/**
 * 調味料追加フォームコンポーネント
 *
 * 調味料の名前、種類、画像を入力するためのフォームを提供します。
 * バリデーション機能付きで、入力内容の検証を行います。
 *
 * @param props - コンポーネントのプロパティ
 * @returns 調味料追加フォームのJSX要素
 */
export const SeasoningAddForm = ({ onSubmit }: Props): React.JSX.Element => {
  const [seasoningTypes, setSeasoningTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeFetchError, setTypeFetchError] = useState("");
  const [typeFetchLoading, setTypeFetchLoading] = useState(false);
  const [typeSuccessMessage, setTypeSuccessMessage] = useState("");

  // 調味料名入力用のカスタムフックを使用
  const seasoningName = useSeasoningNameInput();

  // 調味料の種類選択用のカスタムフックを使用
  const seasoningType = useSeasoningTypeInput();

  // 画像入力用のカスタムフックを使用
  const seasoningImage = useSeasoningImageInput();

  // フォームデータの状態（画像はカスタムフックで管理）
  const formData = { image: seasoningImage.value };

  // フォーム送信用のカスタムフック
  const { submit, isSubmitting, errors, isFormValid } = useSeasoningSubmit(
    seasoningName,
    seasoningType,
    formData,
    onSubmit,
    () => seasoningImage.reset() // リセット時に画像フックをリセット
  );

  useEffect(() => {
    const fetchSeasoningTypes = async () => {
      setTypeFetchLoading(true);
      setTypeFetchError("");
      try {
        const response = await fetch("/api/seasoning-types", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("調味料の種類一覧の取得に失敗しました");
        }

        const body = await response.json();
        const options = (body.data as SeasoningType[]).map((type) => ({
          id: String(type.id),
          name: type.name,
        }));
        setSeasoningTypes(options);
      } catch (error) {
        console.error("Failed to fetch seasoning types", error);
        setTypeFetchError("調味料の種類一覧の取得に失敗しました");
      } finally {
        setTypeFetchLoading(false);
      }
    };

    fetchSeasoningTypes();
  }, []);

  const handleTypeAdded = (newType: SeasoningType) => {
    const option = { id: String(newType.id), name: newType.name };
    setSeasoningTypes((prev) => [...prev, option]);
    seasoningType.onChange({
      target: { value: option.id },
    } as React.ChangeEvent<HTMLSelectElement>);
    setTypeSuccessMessage("調味料の種類を追加しました");
    setIsTypeModalOpen(false);
  };

  const typeOptions = useMemo(
    () =>
      [...seasoningTypes].sort((a, b) =>
        a.name.localeCompare(b.name, "ja-JP", { sensitivity: "base" })
      ),
    [seasoningTypes]
  );

  /**
   * ファイル入力変更時のハンドラー
   *
   * @param e - ファイル入力のChangeEvent
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    seasoningImage.onChange(file);

    // 画像バリデーションは内部で処理されるため、ここではsetImageErrorは不要
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-4"
      role="form"
      aria-label="調味料追加フォーム"
    >
      {/* 全般的なエラーメッセージ */}
      {errors.general && errors.general !== "NONE" ? (
        <ErrorMessage message={errors.general} />
      ) : null}

      {/* 名前フィールド */}
      <TextInput
        id="name"
        name="name"
        label="調味料"
        value={seasoningName.value}
        onChange={seasoningName.onChange}
        onBlur={seasoningName.onBlur}
        placeholder="調味料名を入力"
        maxLength={VALIDATION_CONSTANTS.NAME_MAX_LENGTH}
        required={true}
        errorMessage={seasoningName.error !== "NONE" ? seasoningName.error : ""}
        aria-describedby={
          seasoningName.error !== "NONE" ? "name-error" : undefined
        }
      />

      {/* 種類フィールド */}
      <div className="space-y-2">
        <SelectInput
          id="type"
          name="type"
          label="調味料の種類"
          value={seasoningType.value}
          onChange={seasoningType.onChange}
          onBlur={seasoningType.onBlur}
          options={typeOptions}
          required={true}
          errorMessage={
            seasoningType.error !== "NONE" ? seasoningType.error : ""
          }
          aria-describedby={
            seasoningType.error !== "NONE" ? "type-error" : undefined
          }
        />
        {typeFetchLoading ? (
          <p className="text-sm text-gray-500">種類を読み込み中です...</p>
        ) : null}
        {typeFetchError ? (
          <ErrorMessage message={typeFetchError} />
        ) : null}
        {typeSuccessMessage ? (
          <p className="text-sm text-green-600">{typeSuccessMessage}</p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setTypeSuccessMessage("");
            setIsTypeModalOpen(true);
          }}
          disabled={typeFetchLoading}
          aria-label="新しい調味料の種類を追加"
        >
          新しい調味料の種類を追加
        </Button>
      </div>

      {/* 画像フィールド */}
      <FileInput
        id="image"
        name="image"
        label="調味料の画像"
        onChange={handleFileChange}
        accept={VALIDATION_CONSTANTS.IMAGE_VALID_TYPES.join(",")}
        errorMessage={
          seasoningImage.error !== "NONE"
            ? seasoningImage.error
            : errors.image !== "NONE"
            ? errors.image
            : ""
        }
        helperText={`JPEG または PNG 形式、${VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB}MB以下`}
        aria-describedby={
          seasoningImage.error !== "NONE" || errors.image !== "NONE"
            ? "image-error"
            : "image-help"
        }
      />

      {/* 送信ボタン */}
      <div className="pt-4">
        <SubmitButton
          label="追加"
          loadingLabel="追加中..."
          isSubmitting={isSubmitting}
          disabled={!isFormValid}
          onClick={submit}
          aria-label="調味料を追加する"
        />
      </div>

      <SeasoningTypeAddModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onAdded={handleTypeAdded}
      />
    </form>
  );
};
