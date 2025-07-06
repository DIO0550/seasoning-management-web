# 調味料追加 API ルーティング実装計画

## 📋 タスクの理解と分析

- 現在の OpenAPI 仕様に調味料追加（POST）のエンドポイントを追加
- データベース接続は一旦なしで、モックレスポンスを返す仕様を定義
- `/api/seasoning` エンドポイントに POST メソッドを追加

## 🎯 実装すべき機能・コンポーネントの概要

### 1. POST /api/seasoning エンドポイント追加

- リクエストボディのスキーマ定義
  - 調味料名（name）: 必須
  - 調味料タイプ（type）: 必須
  - 画像（image）: オプション
  - 説明（description）: オプション

### 2. レスポンススキーマ定義

- 201 Created: 作成された調味料の情報
- 400 Bad Request: バリデーションエラー
- 500 Internal Server Error: サーバーエラー

### 3. 適切な HTTP ステータスコードとエラーレスポンス

- 成功時: 201 Created
- エラー時: 適切なエラーコードとメッセージ

## 📁 ファイル構成と変更対象

```
src/app/api/openapi/route.ts - OpenAPI仕様の更新
├── paths オブジェクトに POST メソッド追加
├── リクエストボディスキーマ定義
└── レスポンススキーマ定義
```

## 🔄 実装手順とステップ

### Step 1: 準備作業

1. **新しいブランチを作成**

   ```bash
   git checkout -b feature/add-seasoning-post-api
   ```

2. **既存の調味料型定義を確認**
   - `src/types/seasoningType.ts` をチェック
   - 既存のフォーム設計を参考にスキーマ作成

### Step 2: OpenAPI 仕様更新

3. **POST エンドポイントを追加**

   - `/api/seasoning` の paths に post メソッド追加

4. **リクエストスキーマ定義**

   - requestBody の content/schema 定義
   - 必須フィールドとオプショナルフィールドの設定

5. **レスポンススキーマ定義**
   - 201, 400, 500 のレスポンス定義

### Step 3: コミット作業

6. **細かくコミット分割**（開発ルールに従って）
   - コミット 1: POST エンドポイント基本構造追加
   - コミット 2: リクエストボディスキーマ定義
   - コミット 3: レスポンススキーマ定義
   - コミット 4: エラーレスポンス定義

## 📝 想定する API 仕様詳細

### リクエスト例

```json
POST /api/seasoning
Content-Type: application/json

{
  "name": "醤油",
  "type": "liquid",
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "description": "濃口醤油"
}
```

### レスポンス例

```json
201 Created
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "醤油",
  "type": "liquid",
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "description": "濃口醤油",
  "createdAt": "2025-07-05T10:30:00Z"
}
```

## ✅ 確認事項

この実装計画で進めてよろしいでしょうか？

- 調味料の必要フィールドは上記で適切ですか？
- 他に追加すべき項目はありますか？
- データベース接続なしのモック実装で問題ないですか？
