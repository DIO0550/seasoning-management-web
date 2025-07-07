# 調味料 API ルーティング実装計画

## 📋 概要

RESTful 設計に基づく調味料管理 API（複数形コレクション設計）の実装計画

- **採用パターン**: Pattern 1 - コレクションリソース設計（複数形）
- **API ベース URL**: `/api/seasonings`
- **実装手法**: TDD（Test-Driven Development）

## 🎯 実装目標

### 主要機能

1. 調味料の追加（POST）
2. 調味料一覧取得（GET）
3. 調味料詳細取得（GET）
4. 調味料更新（PUT）
5. 調味料削除（DELETE）
6. 画像アップロード機能
7. 調味料種類マスタ取得

### 品質目標

- テストカバレッジ 90%以上
- レスポンス時間 200ms 以下
- エラーハンドリング 100%対応

## 🛤 API エンドポイント設計

### メインリソース

```
GET    /api/seasonings        # 調味料一覧取得
POST   /api/seasonings        # 調味料追加
GET    /api/seasonings/[id]   # 調味料詳細取得
PUT    /api/seasonings/[id]   # 調味料更新
DELETE /api/seasonings/[id]   # 調味料削除
```

### サブリソース・関連 API

```
POST   /api/seasonings/upload     # 画像アップロード
GET    /api/seasoning-types       # 調味料種類マスタ取得
GET    /api/openapi              # OpenAPI仕様書取得
```

## 📁 ファイル構成

### 新規作成ファイル

```
src/
├── app/api/
│   ├── seasonings/              # 複数形に変更
│   │   ├── route.ts            # GET/POST（一覧・追加）
│   │   ├── route.test.ts       # APIテスト
│   │   ├── [id]/
│   │   │   ├── route.ts        # GET/PUT/DELETE（詳細・更新・削除）
│   │   │   └── route.test.ts   # 個別APIテスト
│   │   └── upload/
│   │       ├── route.ts        # 画像アップロード
│   │       └── route.test.ts   # アップロードテスト
│   ├── seasoning-types/
│   │   ├── route.ts            # 調味料種類マスタAPI
│   │   └── route.test.ts       # マスタAPIテスト
│   └── openapi/
│       └── route.ts            # OpenAPI仕様書配信
├── libs/
│   ├── database/
│   │   ├── seasoning.ts        # 調味料DB操作
│   │   └── seasoning.test.ts   # DB操作テスト
│   └── storage/
│       ├── image.ts            # 画像保存処理
│       └── image.test.ts       # 画像処理テスト
├── types/api/
│   ├── seasonings/             # 複数形に変更
│   │   ├── schemas.ts          # 統合スキーマ
│   │   └── types.ts            # 統合型定義
│   └── openapi/
│       ├── schemas.ts          # OpenAPI用型定義
│       └── types.ts
└── public/swagger/
    └── swagger.json            # OpenAPI仕様書
```

### 変更・移行ファイル

```
移行前: src/app/api/seasoning/
移行後: src/app/api/seasonings/

更新対象:
- フロントエンドのAPI呼び出し先URL
- 既存のimport文
- テストファイル内のURL参照
```

## 🔄 実装手順（TDD）

### Phase 1: API ルーティング基盤整備

1. **Test**: 既存 API (`/api/seasoning`) のテスト移行
2. **Red**: `/api/seasonings` エンドポイントのテスト作成
3. **Green**: 最小限の実装でテストを通す
4. **Refactor**: 既存コードをリファクタリング

### Phase 2: CRUD 機能完成

1. **Test**: 各 HTTP メソッドのテスト作成
2. **Red**: 失敗するテストを確認
3. **Green**: 機能実装
4. **Refactor**: コード品質向上

### Phase 3: 画像アップロード機能

1. **Test**: ファイルアップロードのテスト作成
2. **Red**: バリデーション・保存処理のテスト
3. **Green**: 画像処理実装
4. **Refactor**: パフォーマンス最適化

### Phase 4: エラーハンドリング強化

1. **Test**: エラーケースのテスト作成
2. **Red**: 例外処理のテスト
3. **Green**: 詳細なエラーレスポンス実装
4. **Refactor**: エラー処理の統一化

### Phase 5: OpenAPI 仕様書作成

1. **Test**: API 仕様書の妥当性テスト
2. **Red**: SwaggerUI 表示テスト
3. **Green**: OpenAPI 3.0 仕様書作成
4. **Refactor**: ドキュメント品質向上

## 🧪 テスト戦略

### 単体テスト（Vitest）

```typescript
// 例: route.test.ts
describe("POST /api/seasonings", () => {
  it("正常な調味料データで追加成功", async () => {
    // Arrange
    const seasoningData = {
      name: "salt",
      seasoningTypeId: 1,
      image: null,
    };

    // Act
    const response = await POST(mockRequest(seasoningData));

    // Assert
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({
      id: expect.any(String),
      name: "salt",
      ...seasoningData,
    });
  });
});
```

### 統合テスト

- API エンドポイント間の連携テスト
- データベース操作の整合性テスト
- ファイルアップロードの結合テスト

### E2E テスト

- フロントエンドから API までの完全なフローテスト

## 📊 データ構造設計

### リクエスト/レスポンス型定義

```typescript
// POST /api/seasonings
interface SeasoningCreateRequest {
  name: string;
  seasoningTypeId: number;
  image?: string | null;
}

interface SeasoningCreateResponse {
  id: string;
  name: string;
  seasoningTypeId: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/seasonings
interface SeasoningsListResponse {
  seasonings: SeasoningCreateResponse[];
  total: number;
  page?: number;
  limit?: number;
}
```

### エラーレスポンス統一

```typescript
interface ErrorResponse {
  error: true;
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
```

## 🔐 セキュリティ考慮事項

### 入力値検証

- Zod スキーマによる型安全なバリデーション
- SQL インジェクション対策
- XSS 対策（入力値サニタイゼーション）

### ファイルアップロード

- MIME タイプ検証（JPEG/PNG のみ）
- ファイルサイズ制限（5MB）
- ファイル名サニタイゼーション
- ウイルススキャン（将来実装）

### レート制限

- IP 単位での API 呼び出し制限
- 画像アップロードの頻度制限

## 📈 パフォーマンス最適化

### データベース

- 適切なインデックス設定
- クエリ最適化
- コネクションプーリング

### 画像処理

- アップロード時の自動リサイズ
- WebP 形式への変換
- CDN 配信対応

### キャッシュ戦略

- 調味料種類マスタのメモリキャッシュ
- レスポンスキャッシュ（Redis）

## 🚀 デプロイメント

### 段階的リリース

1. **ステージング環境**: 新 API エンドポイント追加
2. **カナリアリリース**: 一部トラフィックを新 API 転送
3. **本番切り替え**: 旧 API (`/api/seasoning`) から新 API (`/api/seasonings`) へ
4. **旧 API 廃止**: 適切な移行期間後に削除

### モニタリング

- API レスポンス時間監視
- エラー率監視
- ファイルアップロード成功率監視

## 📝 実装チェックリスト

### Phase 1: 基盤整備 ✅ **完了**

- [x] 既存 `/api/seasoning` から `/api/seasonings` への移行
- [x] 基本的な GET/POST エンドポイント実装
- [x] Zod スキーマ定義（仕様書準拠：半角英数字、20 文字制限）
- [x] 基本テスト作成（test.prompt.md ルール準拠、19 テストケース）
- [x] パラメータ化テスト実装（it.each 活用）
- [x] 並行実行テスト対応（test.concurrent）
- [x] 境界値テスト網羅
- [x] エラーレスポンス詳細化（details フィールド追加）

### Phase 2: CRUD 完成

- [ ] 個別リソース操作（GET/PUT/DELETE `/api/seasonings/[id]`）
- [ ] エラーハンドリング強化
- [ ] バリデーション完全実装
- [ ] テストカバレッジ 90%達成

### Phase 3: 画像機能

- [ ] 画像アップロードエンドポイント
- [ ] ファイル形式・サイズ検証
- [ ] 画像保存・取得機能
- [ ] 画像関連テスト

### Phase 4: 拡張機能

- [ ] 調味料種類マスタ API
- [ ] OpenAPI 仕様書生成
- [ ] SwaggerUI 統合
- [ ] パフォーマンス最適化

### Phase 5: 運用準備

- [ ] ログ出力標準化
- [ ] モニタリング設定
- [ ] ドキュメント完成
- [ ] 本番デプロイ準備

---

## 🎯 成功基準

1. **機能性**: 仕様書通りの全機能が動作
2. **品質**: テストカバレッジ 90%以上
3. **パフォーマンス**: レスポンス時間 200ms 以下
4. **保守性**: Tidy First パターンによる清潔なコード
5. **拡張性**: 将来の機能追加に対応可能な設計

この計画に基づいて、段階的に実装を進めていきます。
