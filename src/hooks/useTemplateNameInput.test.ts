import { renderHook, act } from '@testing-library/react';
import { useTemplateNameInput } from './useTemplateNameInput';

describe('useTemplateNameInput', () => {
  test('初期値が空文字である', () => {
    const { result } = renderHook(() => useTemplateNameInput());
    
    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.isValid).toBe(false);
  });

  test('有効な名前を入力した場合', () => {
    const { result } = renderHook(() => useTemplateNameInput());
    
    act(() => {
      result.current.handleChange('朝食セット');
    });

    expect(result.current.value).toBe('朝食セット');
    expect(result.current.error).toBe('');
    expect(result.current.isValid).toBe(true);
  });

  test('空文字を入力した場合', () => {
    const { result } = renderHook(() => useTemplateNameInput());
    
    act(() => {
      result.current.handleChange('');
    });

    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('テンプレート名は必須です。');
    expect(result.current.isValid).toBe(false);
  });

  test('21文字以上を入力した場合', () => {
    const { result } = renderHook(() => useTemplateNameInput());
    const longName = 'あ'.repeat(21);
    
    act(() => {
      result.current.handleChange(longName);
    });

    expect(result.current.value).toBe(longName);
    expect(result.current.error).toBe('テンプレート名は20文字以内で入力してください。');
    expect(result.current.isValid).toBe(false);
  });
});
