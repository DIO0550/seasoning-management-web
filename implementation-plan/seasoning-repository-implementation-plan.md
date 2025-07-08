# 調味料リポジトリパターン実装計画

## タスク分析

### 現状分析

- 現在`/api/seasonings/route.ts`では、モックデータ（配列）を使用して調味料データを管理している
- SQL ファイルから以下のテーブル構造が確認できる：
  - `seasoning`テーブル（調味料）
  - `seasoning_type`テーブル（調味料種類）
  - `seasoning_image`テーブル（調味料画像）
- Prisma は現在未設定、素の MySQL とのやりとりが必要

### 実装目標

DB からの調味料データ取得を行うリポジトリパターンを導入し、現在のモックデータから実際の DB アクセスに変更する

## 実装すべき機能・コンポーネント

### 1. データベース接続設定

- MySQL 接続設定
- 環境変数管理

### 2. エンティティ型定義

- `Seasoning`エンティティ
- `SeasoningType`エンティティ
- `SeasoningImage`エンティティ

### 3. リポジトリインターフェース

- `ISeasoningRepository`インターフェース定義
- 基本的な CRUD 操作のメソッド定義

### 4. リポジトリ実装

- `SeasoningRepository`クラス
- MySQL 直接アクセス実装

### 5. サービス層

- `SeasoningService`クラス
- ビジネスロジックの分離

## ファイル構成と変更対象

### 新規作成するファイル

```
src/
├── entities/                     # エンティティ定義
│   ├── seasoning.ts             # Seasoningエンティティ
│   ├── seasoningType.ts         # SeasoningTypeエンティティ
│   └── seasoningImage.ts        # SeasoningImageエンティティ
├── repositories/                 # リポジトリパターン
│   ├── interfaces/
│   │   ├── ISeasoningRepository.ts      # リポジトリインターフェース
│   │   ├── ISeasoningTypeRepository.ts
│   │   └── ISeasoningImageRepository.ts
│   └── implementations/
│       ├── SeasoningRepository.ts       # MySQL実装
│       ├── SeasoningTypeRepository.ts
│       └── SeasoningImageRepository.ts
├── services/                     # サービス層
│   ├── SeasoningService.ts      # 調味料サービス
│   ├── SeasoningTypeService.ts
│   └── SeasoningImageService.ts
├── libs/database/               # DB接続
│   ├── connection.ts           # MySQL接続設定
│   └── types.ts               # DB関連型定義
└── config/                     # 設定
    ├── database.ts            # DB設定
    └── environment.ts         # 環境変数
```

### 変更対象ファイル

```
src/app/api/seasonings/route.ts   # リポジトリパターン導入
.env.example                      # DB接続情報追加
package.json                      # mysql2パッケージ追加
```

## 実装手順とステップ

### Phase 1: 基盤設定（TDD 準備）

#### 1. 依存関係追加

- [x] `mysql2`パッケージをインストール
- [x] 型定義ファイル（`@types/mysql2`）をインストール（内蔵型定義のため不要）

#### 2. 環境設定

- [x] `.env.example`に DB 接続情報のテンプレート追加
- [x] `src/config/environment.ts`で環境変数管理
- [x] `src/config/database.ts`で DB 設定

### Phase 2: エンティティ定義（TDD）

#### 1. テスト作成

- [ ] `src/entities/__tests__/seasoning.test.ts`作成
- [ ] エンティティの型定義テスト実装
- [ ] バリデーション関数のテスト実装

#### 2. 実装

- [ ] `src/entities/seasoning.ts`作成
- [ ] `src/entities/seasoningType.ts`作成
- [ ] `src/entities/seasoningImage.ts`作成

### Phase 3: データベース接続層（TDD）

#### 1. テスト作成

- [ ] `src/libs/database/__tests__/connection.test.ts`作成
- [ ] 接続テスト（モック使用）実装

#### 2. 実装

- [ ] `src/libs/database/connection.ts`作成
- [ ] `src/libs/database/types.ts`作成

### Phase 4: リポジトリインターフェース（TDD）

#### 1. テスト作成

- [ ] `src/repositories/interfaces/__tests__/ISeasoningRepository.test.ts`作成
- [ ] インターフェース契約のテスト実装

#### 2. 実装

- [ ] `src/repositories/interfaces/ISeasoningRepository.ts`作成
- [ ] `src/repositories/interfaces/ISeasoningTypeRepository.ts`作成
- [ ] `src/repositories/interfaces/ISeasoningImageRepository.ts`作成

### Phase 5: リポジトリ実装（TDD）

#### 1. テスト作成

- [ ] `src/repositories/implementations/__tests__/SeasoningRepository.test.ts`作成
- [ ] モック DB を使ったテスト実装
- [ ] CRUD 操作のテスト実装

#### 2. 実装

- [ ] `src/repositories/implementations/SeasoningRepository.ts`作成
- [ ] MySQL 直接クエリの実装

### Phase 6: サービス層（TDD）

#### 1. テスト作成

- [ ] `src/services/__tests__/SeasoningService.test.ts`作成
- [ ] ビジネスロジックテスト実装
- [ ] エラーハンドリングテスト実装

#### 2. 実装

- [ ] `src/services/SeasoningService.ts`作成
- [ ] リポジトリの依存性注入実装
- [ ] ビジネスルールの実装

### Phase 7: API ルート統合（TDD）

#### 1. テスト作成

- [ ] `src/app/api/seasonings/__tests__/route.test.ts`作成
- [ ] エンドツーエンドテスト実装
- [ ] レスポンス形式テスト実装

#### 2. 実装

- [ ] `src/app/api/seasonings/route.ts`の変更
- [ ] モックデータから DB アクセスへの移行実装

## 技術的考慮事項

### 1. コード規約遵守

- ESLint/Prettier 準拠
- 早期 return パターン
- マジックナンバー排除
- クラス不使用（関数型アプローチ）
- interface/type 使い分け
- コンパニオンオブジェクトパターン

### 2. テスト戦略

- TDD（Red → Green → Refactor）
- Vitest を使用
- モック DB（`jest-mock-mysql2`または独自実装）
- テストカバレッジ 90%以上

### 3. エラーハンドリング

- DB 接続エラー
- クエリ実行エラー
- データ変換エラー
- 型安全性の確保

### 4. パフォーマンス

- コネクションプーリング
- トランザクション管理
- インデックス活用
- クエリ最適化

## リスク・注意事項

### 1. 既存 API 互換性

- 現在の API レスポンス形式を維持
- エラーレスポンス形式の継続
- HTTP ステータスコード一貫性

### 2. データベース関連

- MySQL 接続設定の環境差分
- SQL クエリの型安全性
- トランザクション境界の設計

### 3. テスト環境

- テスト用 DB の設定
- モックの適切な使用
- 統合テストの環境依存

## 実装後の期待される効果

1. **保守性向上**

   - 責務分離による可読性向上
   - テスタビリティの向上
   - 変更影響範囲の限定

2. **拡張性向上**

   - 新しいエンティティの追加容易性
   - 異なる DB 実装への対応可能性
   - ビジネスロジックの独立性

3. **信頼性向上**
   - 型安全性によるバグ削減
   - テストカバレッジによる品質担保
   - エラーハンドリングの統一

## 次のステップ

1. この実装計画のレビューと承認
2. Phase 1 からの順次実装開始
3. 各 Phase でのテスト結果確認
4. 必要に応じた計画調整

---

**注意**: この計画は TDD（テスト駆動開発）に基づいており、各実装ステップでテストファーストアプローチを採用します。
