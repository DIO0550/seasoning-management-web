import { renderHook, act } from '@testing-library/react';
import { useSeasoningSubmit } from './useSeasoningSubmit';
import { UseSeasoningNameInputReturn } from './useSeasoningNameInput';
import { UseSeasoningTypeInputReturn } from './useSeasoningTypeInput';
import { vi } from 'vitest';

// モックの作成
const createMockSeasoningNameInput = (value = '', error = ''): UseSeasoningNameInputReturn => ({
  value,
  error,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  reset: vi.fn(),
});

const createMockSeasoningTypeInput = (value = '', error = ''): UseSeasoningTypeInputReturn => ({
  value,
  error,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  reset: vi.fn(),
});

describe('useSeasoningSubmit', () => {
  test('初期状態が正しく設定されること', () => {
    const mockSeasoningName = createMockSeasoningNameInput();
    const mockSeasoningType = createMockSeasoningTypeInput();
    const mockFormData = { image: null };

    const { result } = renderHook(() => 
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors.image).toBe('');
    expect(result.current.errors.general).toBe('');
    expect(result.current.isFormValid).toBe(false);
  });

  test('必須フィールドが入力されるとフォームが有効になること', () => {
    const mockSeasoningName = createMockSeasoningNameInput('salt', '');
    const mockSeasoningType = createMockSeasoningTypeInput('salt', '');
    const mockFormData = { image: null };

    const { result } = renderHook(() => 
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    expect(result.current.isFormValid).toBe(true);
  });

  test('エラーがある場合はフォームが無効になること', () => {
    const mockSeasoningName = createMockSeasoningNameInput('salt', 'エラー');
    const mockSeasoningType = createMockSeasoningTypeInput('salt', '');
    const mockFormData = { image: null };

    const { result } = renderHook(() => 
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    expect(result.current.isFormValid).toBe(false);
  });

  test('画像エラーを設定できること', () => {
    const mockSeasoningName = createMockSeasoningNameInput();
    const mockSeasoningType = createMockSeasoningTypeInput();
    const mockFormData = { image: null };

    const { result } = renderHook(() => 
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData)
    );

    act(() => {
      result.current.setImageError('画像エラー');
    });

    expect(result.current.errors.image).toBe('画像エラー');
  });

  test('送信処理が正常に動作すること', async () => {
    const mockSeasoningName = createMockSeasoningNameInput('salt', '');
    const mockSeasoningType = createMockSeasoningTypeInput('salt', '');
    const mockFormData = { image: null };
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockOnReset = vi.fn();

    const { result } = renderHook(() => 
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData, mockOnSubmit, mockOnReset)
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'salt',
      type: 'salt',
      image: null
    });
    expect(mockSeasoningName.reset).toHaveBeenCalled();
    expect(mockSeasoningType.reset).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });

  test('送信エラーが適切に処理されること', async () => {
    const mockSeasoningName = createMockSeasoningNameInput('salt', '');
    const mockSeasoningType = createMockSeasoningTypeInput('salt', '');
    const mockFormData = { image: null };
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error('送信エラー'));

    const { result } = renderHook(() => 
      useSeasoningSubmit(mockSeasoningName, mockSeasoningType, mockFormData, mockOnSubmit)
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.general).toBe('送信エラー');
    expect(result.current.isSubmitting).toBe(false);
  });
});