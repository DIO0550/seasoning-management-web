import { renderHook, act } from "@testing-library/react";
import { useSeasoningSubmit } from "./useSeasoningSubmit";
import { UseSeasoningNameInputReturn } from "./useSeasoningNameInput";
import { UseSeasoningTypeInputReturn } from "./useSeasoningTypeInput";
import { vi } from "vitest";
import { VALIDATION_ERROR_STATES } from "../types/validationErrorState";
import type { ValidationErrorState } from "../types/validationErrorState";
import { SUBMIT_ERROR_STATES } from "../types/submitErrorState";

// モックの作成
const createMockSeasoningNameInput = (
  value = "",
  error: ValidationErrorState = VALIDATION_ERROR_STATES.NONE
): UseSeasoningNameInputReturn => ({
  value,
  error,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  reset: vi.fn(),
});

const createMockSeasoningTypeInput = (
  value = "",
  error: ValidationErrorState = VALIDATION_ERROR_STATES.NONE
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
    expect(result.current.errors.image).toBe(VALIDATION_ERROR_STATES.NONE);
    expect(result.current.errors.general).toBe(VALIDATION_ERROR_STATES.NONE);
    expect(result.current.isFormValid).toBe(false);
  });

  test("必須フィールドが入力されるとフォームが有効になること", () => {
    const mockSeasoningName = createMockSeasoningNameInput(
      "salt",
      VALIDATION_ERROR_STATES.NONE
    );
    const mockSeasoningType = createMockSeasoningTypeInput(
      "salt",
      VALIDATION_ERROR_STATES.NONE
    );
    const mockFormData = { image: null };

    const { result } = renderHook(() =>
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    expect(result.current.isFormValid).toBe(true);
  });

  test("エラーがある場合はフォームが無効になること", () => {
    const mockSeasoningName = createMockSeasoningNameInput(
      "salt",
      VALIDATION_ERROR_STATES.REQUIRED
    );
    const mockSeasoningType = createMockSeasoningTypeInput(
      "salt",
      VALIDATION_ERROR_STATES.NONE
    );
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
      result.current.setImageError(VALIDATION_ERROR_STATES.INVALID_FILE_TYPE);
    });

    expect(result.current.errors.image).toBe(
      VALIDATION_ERROR_STATES.INVALID_FILE_TYPE
    );
  });

  test("送信処理が正常に動作すること", async () => {
    const mockSeasoningName = createMockSeasoningNameInput(
      "salt",
      VALIDATION_ERROR_STATES.NONE
    );
    const mockSeasoningType = createMockSeasoningTypeInput(
      "salt",
      VALIDATION_ERROR_STATES.NONE
    );
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
    const mockSeasoningName = createMockSeasoningNameInput(
      "salt",
      VALIDATION_ERROR_STATES.NONE
    );
    const mockSeasoningType = createMockSeasoningTypeInput(
      "salt",
      VALIDATION_ERROR_STATES.NONE
    );
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

    expect(result.current.errors.general).toBe(
      SUBMIT_ERROR_STATES.UNKNOWN_ERROR
    );
    expect(result.current.isSubmitting).toBe(false);
  });

  describe("リファクタリング後の単一責任テスト", () => {
    test("バリデーション処理が独立して動作すること", async () => {
      const { validateImage } = await import("../utils/imageValidation");

      const mockValidateImage = vi.mocked(validateImage);

      mockValidateImage.mockReturnValue("SIZE_EXCEEDED");

      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockFormData = { image: file };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(mockValidateImage).toHaveBeenCalledWith(file);
      expect(result.current.errors.image).toBe(
        VALIDATION_ERROR_STATES.FILE_TOO_LARGE
      );
    });

    test("フォーム状態リセット機能が独立して動作すること", async () => {
      const { validateImage } = await import("../utils/imageValidation");

      const mockValidateImage = vi.mocked(validateImage);

      // バリデーションが成功するよう設定
      mockValidateImage.mockReturnValue("NONE");

      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
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
        result.current.setImageError(VALIDATION_ERROR_STATES.FILE_TOO_LARGE);
      });

      expect(result.current.errors.image).toBe(
        VALIDATION_ERROR_STATES.FILE_TOO_LARGE
      );

      // 送信処理でリセットされることを確認
      await act(async () => {
        await result.current.submit();
      });

      expect(mockSeasoningName.reset).toHaveBeenCalled();
      expect(mockSeasoningType.reset).toHaveBeenCalled();
      expect(mockOnReset).toHaveBeenCalled();
      expect(result.current.errors.image).toBe(VALIDATION_ERROR_STATES.NONE);
      expect(result.current.errors.general).toBe(VALIDATION_ERROR_STATES.NONE);
    });

    test("エラーメッセージが定数から取得されること", async () => {
      const { validateImage } = await import("../utils/imageValidation");

      const mockValidateImage = vi.mocked(validateImage);

      // バリデーションが成功するよう設定
      mockValidateImage.mockReturnValue("NONE");

      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
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
        SUBMIT_ERROR_STATES.UNKNOWN_ERROR
      );
    });

    test("バリデーション関数が適切な引数で呼び出されること", async () => {
      const { validateImage } = await import("../utils/imageValidation");

      const mockValidateImage = vi.mocked(validateImage);

      mockValidateImage.mockReturnValue("NONE");

      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockFormData = { image: file };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(mockValidateImage).toHaveBeenCalledWith(file);
    });
  });

  describe("リファクタリング後の責務分離テスト", () => {
    test("送信成功時にresetFormStateが呼び出されること", async () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnReset = vi.fn();

      const { validateImage } = await import("../utils/imageValidation");

      const mockValidateImage = vi.mocked(validateImage);

      mockValidateImage.mockReturnValue("NONE");

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
      expect(result.current.errors.image).toBe(VALIDATION_ERROR_STATES.NONE);
      expect(result.current.errors.general).toBe(VALIDATION_ERROR_STATES.NONE);
    });

    test("エラーハンドリングで適切なエラーメッセージが設定されること", async () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };
      const mockOnSubmit = vi
        .fn()
        .mockRejectedValue(new Error("ネットワークエラー"));

      const { validateImage } = await import("../utils/imageValidation");

      const mockValidateImage = vi.mocked(validateImage);

      mockValidateImage.mockReturnValue("NONE");

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
      expect(result.current.errors.general).toBe(
        SUBMIT_ERROR_STATES.UNKNOWN_ERROR
      );
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
        result.current.setImageError(VALIDATION_ERROR_STATES.INVALID_FILE_TYPE);
      });

      expect(result.current.errors.image).toBe(
        VALIDATION_ERROR_STATES.INVALID_FILE_TYPE
      );
      expect(result.current.errors.general).toBe(VALIDATION_ERROR_STATES.NONE); // generalエラーは変更されない
    });
  });

  describe("フォーム有効性計算の改善テスト", () => {
    test("必須フィールドが揃っていてエラーがない場合のみフォームが有効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      expect(result.current.isFormValid).toBe(true);
    });

    test("必須フィールドのいずれかが空の場合、フォームが無効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "",
        VALIDATION_ERROR_STATES.NONE
      ); // 名前が空
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      expect(result.current.isFormValid).toBe(false);
    });

    test("バリデーションエラーがある場合、フォームが無効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.REQUIRED
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      expect(result.current.isFormValid).toBe(false);
    });

    test("画像エラーがある場合、フォームが無効になること", () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 画像エラーを設定
      act(() => {
        result.current.setImageError(VALIDATION_ERROR_STATES.INVALID_FILE_TYPE);
      });

      expect(result.current.isFormValid).toBe(false);
    });

    test("送信エラー時にフォームが無効になること", async () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
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

      // 送信処理を実行してエラーを発生させる
      await act(async () => {
        await result.current.submit();
      });

      // 送信エラーが発生した後はフォームが無効になる
      expect(result.current.errors.general).toBe(
        SUBMIT_ERROR_STATES.UNKNOWN_ERROR
      );
      expect(result.current.isFormValid).toBe(false);
    });
  });

  describe("フォーム有効性チェックの可読性改善", () => {
    test("エラーがない状態を明確に判定できること", () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
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
        VALIDATION_ERROR_STATES.REQUIRED
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 名前フィールドにエラーがある場合、フォームが無効になることを確認
      expect(result.current.isFormValid).toBe(false);
    });

    test("画像エラーがある場合の判定が明確であること", () => {
      const mockSeasoningName = createMockSeasoningNameInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockSeasoningType = createMockSeasoningTypeInput(
        "salt",
        VALIDATION_ERROR_STATES.NONE
      );
      const mockFormData = { image: null };

      const { result } = renderHook(() =>
        useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
      );

      // 画像エラーを設定
      act(() => {
        result.current.setImageError(VALIDATION_ERROR_STATES.INVALID_FILE_TYPE);
      });

      // 画像エラーがある場合、フォームが無効になることを確認
      expect(result.current.isFormValid).toBe(false);
    });
  });
});
