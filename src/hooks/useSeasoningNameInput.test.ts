import { renderHook, act } from '@testing-library/react';
import { useSeasoningNameInput } from './useSeasoningNameInput';

describe('useSeasoningNameInput', () => {
  test('初期値が空文字でエラーがないこと', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('');
  });

  test('onChangeが呼ばれた時に値が更新されること', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onChange({
        target: { value: 'salt' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.value).toBe('salt');
  });

  test('空の値でブラーした時に必須バリデーションが動作すること', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onBlur({
        target: { value: '' }
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は必須です');
  });

  test('長すぎる名前でブラーした時に長さバリデーションが動作すること', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    const longName = 'a'.repeat(21); // 21文字、20文字の制限を超過
    
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

  test('無効な文字でブラーした時に英数字バリデーションが動作すること', () => {
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

  test('有効な英数字の名前ではエラーが表示されないこと', () => {
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

  test('ブラーだけでなく入力時にもバリデーションが動作すること', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    act(() => {
      result.current.onChange({
        target: { value: 'salt-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は半角英数字で入力してください');
  });

  test('無効な値の後に有効な値を入力した時にエラーがクリアされること', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    // 無効な値を入力
    act(() => {
      result.current.onChange({
        target: { value: 'salt-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('調味料名は半角英数字で入力してください');
    
    // 有効な値を入力
    act(() => {
      result.current.onChange({
        target: { value: 'salt' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.error).toBe('');
  });

  test('resetが呼ばれた時に値とエラーがリセットされること', () => {
    const { result } = renderHook(() => useSeasoningNameInput());
    
    // 値とエラーを設定
    act(() => {
      result.current.onChange({
        target: { value: 'salt-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.value).toBe('salt-1');
    expect(result.current.error).toBe('調味料名は半角英数字で入力してください');
    
    // リセット
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('');
  });

  test('ちょうど20文字でエラーが出ないこと', () => {
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