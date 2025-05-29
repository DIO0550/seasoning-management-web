import { renderHook, act } from '@testing-library/react';
import { useSeasoningNameInput } from '../useSeasoningNameInput';

describe('useSeasoningNameInput', () => {
  test('should initialize with empty value and no error', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('');
  });

  test('should update value when onChange is called', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onChange({
        target: { value: 'salt' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.value).toBe('salt');
  });

  test('should validate name is required on blur with empty value', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onBlur({
        target: { value: '' }
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は必須です');
  });

  test('should validate name length on blur when too long', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    const longName = 'a'.repeat(21); // 21 characters, exceeds limit of 20
    
    act(() => {
      result.current.onChange({
        target: { value: longName }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    act(() => {
      result.current.onBlur({
        target: { value: longName }
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は 20 文字以内で入力してください');
  });

  test('should validate alphanumeric characters on blur with invalid characters', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onChange({
        target: { value: 'salt-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    act(() => {
      result.current.onBlur({
        target: { value: 'salt-1' }
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は半角英数字で入力してください');
  });

  test('should not show error for valid alphanumeric name', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onChange({
        target: { value: 'salt123' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    act(() => {
      result.current.onBlur({
        target: { value: 'salt123' }
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('');
  });

  test('should validate on change as well as on blur', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onChange({
        target: { value: 'salt-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は半角英数字で入力してください');
  });

  test('should clear error when valid value is entered after invalid', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    // Enter invalid value
    act(() => {
      result.current.onChange({
        target: { value: 'salt-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は半角英数字で入力してください');
    
    // Enter valid value
    act(() => {
      result.current.onChange({
        target: { value: 'salt' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('');
  });

  test('should reset value and error when reset is called', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    // Set some value and error
    act(() => {
      result.current.onChange({
        target: { value: 'salt-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.value).toBe('salt-1');
    expect(result.current.error).toBe('調味料名は半角英数字で入力してください');
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('');
  });

  test('should handle exactly 20 characters without error', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    const exactlyTwentyChars = 'a'.repeat(20);
    
    act(() => {
      result.current.onChange({
        target: { value: exactlyTwentyChars }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    act(() => {
      result.current.onBlur({
        target: { value: exactlyTwentyChars }
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('');
  });
});