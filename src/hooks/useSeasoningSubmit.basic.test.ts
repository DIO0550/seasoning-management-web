import { renderHook, act } from "@testing-library/react";
import { useSeasoningSubmit } from "@/hooks/useSeasoningSubmit";
import { UseSeasoningNameInputReturn } from "@/hooks/useSeasoningNameInput";
import { UseSeasoningTypeInputReturn } from "@/hooks/useSeasoningTypeInput";
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
  validateImage: vi.fn(() => "NONE"),
}));

describe("useSeasoningSubmit - 基本テスト", () => {
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
    expect(result.current.errors.image).toBeNull();
    expect(result.current.errors.general).toBeNull();
    expect(result.current.isFormValid).toBe(false);
  });

  test("エラー種別を正しく設定できること", () => {
    const mockSeasoningName = createMockSeasoningNameInput("テスト", "");
    const mockSeasoningType = createMockSeasoningTypeInput("タイプ", "");
    const mockFormData = { image: null };

    const { result } = renderHook(() =>
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    act(() => {
      result.current.setImageError("INVALID_FILE_TYPE");
    });

    expect(result.current.errors.image).toBe("INVALID_FILE_TYPE");
    expect(result.current.errors.general).toBeNull();
  });

  test("送信エラーが適切に処理されること", async () => {
    const mockSeasoningName = createMockSeasoningNameInput("テスト", "");
    const mockSeasoningType = createMockSeasoningTypeInput("タイプ", "");
    const mockFormData = { image: null };
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error("Test error"));

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

    expect(result.current.errors.general).toBe("UNKNOWN_ERROR");
    expect(result.current.isSubmitting).toBe(false);
  });

  test("ネットワークエラーを正しく識別すること", async () => {
    const mockSeasoningName = createMockSeasoningNameInput("テスト", "");
    const mockSeasoningType = createMockSeasoningTypeInput("タイプ", "");
    const mockFormData = { image: null };

    const networkError = new Error("Network failed");
    networkError.name = "NetworkError";
    const mockOnSubmit = vi.fn().mockRejectedValue(networkError);

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

    expect(result.current.errors.general).toBe("NETWORK_ERROR");
  });
});
