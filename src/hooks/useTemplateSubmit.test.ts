import { renderHook, act } from '@testing-library/react';
import { useTemplateSubmit } from './useTemplateSubmit';

describe('useTemplateSubmit', () => {
  test('初期状態では送信中でない', () => {
    const { result } = renderHook(() => useTemplateSubmit());
    
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe('');
  });

  test('送信処理が実行される', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useTemplateSubmit(mockOnSubmit));
    
    const formData = {
      name: 'テストテンプレート',
      description: 'テスト用の説明',
      seasoningIds: ['seasoning1', 'seasoning2']
    };

    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(formData);
    expect(result.current.error).toBe('');
  });

  test('送信中はisSubmittingがtrueになる', async () => {
    let resolveSubmit: () => void;
    const mockOnSubmit = vi.fn(() => new Promise<void>(resolve => {
      resolveSubmit = resolve;
    }));
    
    const { result } = renderHook(() => useTemplateSubmit(mockOnSubmit));
    
    const formData = {
      name: 'テストテンプレート',
      description: 'テスト用の説明',
      seasoningIds: ['seasoning1', 'seasoning2']
    };

    act(() => {
      result.current.handleSubmit(formData);
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolveSubmit!();
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});
