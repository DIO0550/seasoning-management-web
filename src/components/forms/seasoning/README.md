# 調味料追加フォームコンポーネント

この調味料追加フォームコンポーネントは、調味料追加ページ仕様に基づいて実装されています。

## コンポーネントの使用方法

```tsx
import { SeasoningAddForm } from '@/components/forms/seasoning/SeasoningAddForm';

// 使用例
const YourComponent = () => {
  const handleSubmit = async (data) => {
    try {
      // ここで API を呼び出し、データを送信する
      console.log('送信データ:', data);
      // 成功時の処理
    } catch (error) {
      // エラー時の処理
      console.error('エラー:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">調味料追加</h1>
      <SeasoningAddForm onSubmit={handleSubmit} />
    </div>
  );
};
```

## フォームの機能

- 調味料名（必須）：最大20文字、半角英数字のみ
- 調味料の種類（必須）：選択式
- 調味料の画像（任意）：JPEG または PNG 形式、最大5MB

## バリデーション機能

- フィールドごとのバリデーション
- エラーメッセージの表示
- フォーム送信時の全体バリデーション

## エラーハンドリング

- 各フィールドのエラーは、フィールド直下に赤文字で表示
- API エラーは、フォーム上部にエラーメッセージとして表示

## 設計の特徴

- React Hooks を使用したフォーム状態管理
- タイプセーフな実装
- アクセシビリティに配慮した UI
- 再利用可能なコンポーネント設計

## テスト

コンポーネントのテストは以下のコマンドで実行できます：

```bash
npm test
```