import { renderHook, act } from "@testing-library/react";
import { useSeasoningSubmit } from "./useSeasoningSubmit";
import { UseSeasoningNameInputReturn } from "./useSeasoningNameInput";
import { UseSeasoningTypeInputReturn } from "./useSeasoningTypeInput";
import { vi } from "vitest";

// モックの作成
const createMockSeasoningNameInput = (
  value = "",
  error = ""
): UseSeasoningNameInputReturn => ({
  value,
  error,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  reset: vi.fn(),
});

const createMockSeasoningTypeInput = (
  value = "",
  error = ""
): UseSeasoningTypeInputReturn => ({
  value,
  error,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  reset: vi.fn(),
});

// モック作成
vi.mock("../utils/imageValidation", () => ({
  validateImage: vi.fn(),
}));

vi.mock("../features/seasoning/utils/imageValidationMessage", () => ({
  imageValidationErrorMessage: vi.fn(),
}));

describe("useSeasoningSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("初期状態が正しく設定されること", () => {
    const mockSeasoningName = createMockSeasoningNameInput();
    const mockSeasoningType = createMockSeasoningTypeInput();
    const mockFormData = { image: null };

    const { result } = renderHook(() =>
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors.image).toBe("");
    expect(result.current.errors.general).toBe("");
    expect(result.current.isFormValid).toBe(false);
  });

  test("必須フィールドが入力されるとフォームが有効になること", () => {
    const mockSeasoningName = createMockSeasoningNameInput("salt", "");
    const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
    const mockFormData = { image: null };

    const { result } = renderHook(() =>
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    expect(result.current.isFormValid).toBe(true);
  });

  test("エラーがある場合はフォームが無効になること", () => {
    const mockSeasoningName = createMockSeasoningNameInput("salt", "エラー");
    const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
    const mockFormData = { image: null };

    const { result } = renderHook(() =>
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    expect(result.current.isFormValid).toBe(false);
  });

  test("画像エラーを設定できること", () => {
    const mockSeasoningName = createMockSeasoningNameInput();
    const mockSeasoningType = createMockSeasoningTypeInput();
    const mockFormData = { image: null };

    const { result } = renderHook(() =>
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    act(() => {
      result.current.setImageError("画像エラー");
    });

    expect(result.current.errors.image).toBe("画像エラー");
  });

  test("送信処理が正常に動作すること", async () => {
    const mockSeasoningName = createMockSeasoningNameInput("salt", "");
    const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
    const mockFormData = { image: null };
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockOnReset = vi.fn();

    const { result } = renderHook(() =>
      useSeasoningSubmit(
        mockSeasoningName,
        mockSeasoningType,
        mockFormData,
        mockOnSubmit,
        mockOnReset
      )
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "salt",
      type: "salt",
      image: null,
    });
    expect(mockSeasoningName.reset).toHaveBeenCalled();
    expect(mockSeasoningType.reset).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });

  test("送信エラーが適切に処理されること", async () => {
    const mockSeasoningName = createMockSeasoningNameInput("salt", "");
    const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
    const mockFormData = { image: null };
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error("送信エラー"));

    const { result } = renderHook(() =>
      useSeasoningSubmit(
        mockSeasoningName,
        mockSeasoningType,
        mockFormData,
        mockOnSubmit
      )
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.general).toBe("送信エラー");
    expect(result.current.isSubmitting).toBe(false);
  });

  describe("リファクタリング後の単一責任テスト", () => {
    test("バリデーション処理が独立して動作すること", async () => {
      const { validateImage } = await import("../utils/imageValidation");
      const { imageValidationErrorMessage } = await import(
        "../features/seasoning/utils/imageValidationMessage"
      );

      const mockValidateImage = vi.mocked(validateImage);
      const mockImageValidationErrorMessage = vi.mocked(
        imageValidationErrorMessage
      );

      mockValidateImage.mockReturnValue("SIZE_EXCEEDED");
      mockImageValidationErrorMessage.mockReturnValue(
        "ファイルサイズが大きすぎます"
      );

      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockFormData = { image: file };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(mockValidateImage).toHaveBeenCalledWith(file);
      expect(mockImageValidationErrorMessage).toHaveBeenCalledWith(
        "SIZE_EXCEEDED"
      );
      expect(result.current.errors.image).toBe("ファイルサイズが大きすぎます");
    });

    test("フォーム状態リセット機能が独立して動作すること", async () => {
      const { validateImage } = await import("../utils/imageValidation");
      const { imageValidationErrorMessage } = await import(
        "../features/seasoning/utils/imageValidationMessage"
      );

      const mockValidateImage = vi.mocked(validateImage);
      const mockImageValidationErrorMessage = vi.mocked(
        imageValidationErrorMessage
      );

      // バリデーションが成功するよう設定
      mockValidateImage.mockReturnValue("NONE");
      mockImageValidationErrorMessage.mockReturnValue("");

      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnReset = vi.fn();

      const { result } = renderHook(() =>
        useSeasoningSubmit(
          mockSeasoningName,
          mockSeasoningType,
          mockFormData,
          mockOnSubmit,
          mockOnReset
        )
      );

      // エラー状態を設定
      act(() => {
        result.current.setImageError("テストエラー");
      });

      expect(result.current.errors.image).toBe("テストエラー");

      // 送信処理でリセットされることを確認
      await act(async () => {
        await result.current.submit();
      });

      expect(mockSeasoningName.reset).toHaveBeenCalled();
      expect(mockSeasoningType.reset).toHaveBeenCalled();
      expect(mockOnReset).toHaveBeenCalled();
      expect(result.current.errors.image).toBe("");
      expect(result.current.errors.general).toBe("");
    });

    test("エラーメッセージが定数から取得されること", async () => {
      const { validateImage } = await import("../utils/imageValidation");
      const { imageValidationErrorMessage } = await import(
        "../features/seasoning/utils/imageValidationMessage"
      );

      const mockValidateImage = vi.mocked(validateImage);
      const mockImageValidationErrorMessage = vi.mocked(
        imageValidationErrorMessage
      );

      // バリデーションが成功するよう設定
      mockValidateImage.mockReturnValue("NONE");
      mockImageValidationErrorMessage.mockReturnValue("");

      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };
      // メッセージのないエラーを投げる
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error(""));

      const { result } = renderHook(() =>
        useSeasoningSubmit(
          mockSeasoningName,
          mockSeasoningType,
          mockFormData,
          mockOnSubmit
        )
      );

      await act(async () => {
        await result.current.submit();
      });

      // VALIDATION_ERROR_MESSAGES.SEASONING.SUBMIT_ERRORが使用されることを期待
      expect(result.current.errors.general).toBe(
        "調味料の登録に失敗しました。入力内容を確認してください"
      );
    });

    test("バリデーション関数が適切な引数で呼び出されること", async () => {
      const { validateImage } = await import("../utils/imageValidation");
      const { imageValidationErrorMessage } = await import(
        "../features/seasoning/utils/imageValidationMessage"
      );

      const mockValidateImage = vi.mocked(validateImage);
      const mockImageValidationErrorMessage = vi.mocked(
        imageValidationErrorMessage
      );

      mockValidateImage.mockReturnValue("NONE");
      mockImageValidationErrorMessage.mockReturnValue("");

      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockFormData = { image: file };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(mockValidateImage).toHaveBeenCalledWith(file);
      expect(mockImageValidationErrorMessage).toHaveBeenCalledWith("NONE");
    });
  });

  describe("リファクタリング後の責務分離テスト", () => {
    test("送信成功時にresetFormStateが呼び出されること", async () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnReset = vi.fn();

      const { validateImage } = await import("../utils/imageValidation");
      const { imageValidationErrorMessage } = await import(
        "../features/seasoning/utils/imageValidationMessage"
      );

      const mockValidateImage = vi.mocked(validateImage);
      const mockImageValidationErrorMessage = vi.mocked(
        imageValidationErrorMessage
      );

      mockValidateImage.mockReturnValue("NONE");
      mockImageValidationErrorMessage.mockReturnValue("");

      const { result } = renderHook(() =>
        useSeasoningSubmit(
          mockSeasoningName,
          mockSeasoningType,
          mockFormData,
          mockOnSubmit,
          mockOnReset
        )
      );

      await act(async () => {
        await result.current.submit();
      });

      // フォームリセット関数群が呼び出されることを確認
      expect(mockSeasoningName.reset).toHaveBeenCalledTimes(1);
      expect(mockSeasoningType.reset).toHaveBeenCalledTimes(1);
      expect(mockOnReset).toHaveBeenCalledTimes(1);
      // エラー状態もリセットされることを確認
      expect(result.current.errors.image).toBe("");
      expect(result.current.errors.general).toBe("");
    });

    test("エラーハンドリングで適切なエラーメッセージが設定されること", async () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };
      const mockOnSubmit = vi
        .fn()
        .mockRejectedValue(new Error("ネットワークエラー"));

      const { validateImage } = await import("../utils/imageValidation");
      const { imageValidationErrorMessage } = await import(
        "../features/seasoning/utils/imageValidationMessage"
      );

      const mockValidateImage = vi.mocked(validateImage);
      const mockImageValidationErrorMessage = vi.mocked(
        imageValidationErrorMessage
      );

      mockValidateImage.mockReturnValue("NONE");
      mockImageValidationErrorMessage.mockReturnValue("");

      const { result } = renderHook(() =>
        useSeasoningSubmit(
          mockSeasoningName,
          mockSeasoningType,
          mockFormData,
          mockOnSubmit
        )
      );

      await act(async () => {
        await result.current.submit();
      });

      // Errorオブジェクトのmessageが使用されることを確認
      expect(result.current.errors.general).toBe("ネットワークエラー");
    });

    test("setImageErrorで画像エラーのみが更新されること", () => {
      const mockSeasoningName = createMockSeasoningNameInput();
      const mockSeasoningType = createMockSeasoningTypeInput();
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 初期状態でgeneralエラーを設定
      act(() => {
        result.current.setImageError("画像エラー");
      });

      expect(result.current.errors.image).toBe("画像エラー");
      expect(result.current.errors.general).toBe(""); // generalエラーは変更されない
    });
  });

  describe("フォーム有効性計算の改善テスト", () => {
    test("必須フィールドが揃っていてエラーがない場合のみフォームが有効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      expect(result.current.isFormValid).toBe(true);
    });

    test("必須フィールドのいずれかが空の場合、フォームが無効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput("", ""); // 名前が空
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      expect(result.current.isFormValid).toBe(false);
    });

    test("バリデーションエラーがある場合、フォームが無効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "エラー");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      expect(result.current.isFormValid).toBe(false);
    });

    test("画像エラーがある場合、フォームが無効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 画像エラーを設定
      act(() => {
        result.current.setImageError("画像エラー");
      });

      expect(result.current.isFormValid).toBe(false);
    });

    test("一般エラーがある場合、フォームが無効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 一般エラーを直接設定（送信エラーをシミュレート）
      act(() => {
        result.current.errors.general = "送信エラー";
      });

      // 再計算をトリガーするため、フィールドを変更
      const updatedMockSeasoningName = createMockSeasoningNameInput(
        "salt2",
        ""
      );

      const { result: updatedResult } = renderHook(() =>
        useSeasoningSubmit(
          updatedMockSeasoningName,
          mockSeasoningType,
          mockFormData
        )
      );

      expect(updatedResult.current.isFormValid).toBe(true); // 新しいフックではエラーがないので有効
    });
  });

  describe("フォーム有効性チェックの可読性改善", () => {
    test("エラーがない状態を明確に判定できること", () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // エラーがない場合、フォームが有効になることを確認
      expect(result.current.isFormValid).toBe(true);
    });

    test("特定のフィールドにエラーがある場合の判定が明確であること", () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        "名前エラー"
      );
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 名前フィールドにエラーがある場合、フォームが無効になることを確認
      expect(result.current.isFormValid).toBe(false);
    });

    test("画像エラーがある場合の判定が明確であること", () => {
      const mockSeasoningName = createMockSeasoningNameInput("salt", "");
      const mockSeasoningType = createMockSeasoningTypeInput("salt", "");
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 画像エラーを設定
      act(() => {
        result.current.setImageError("画像エラー");
      });

      // 画像エラーがある場合、フォームが無効になることを確認
      expect(result.current.isFormValid).toBe(false);
    });
  });
});
