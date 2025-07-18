# クリーンアーキテクチャー DB 層 実装計画

## 概要

クリーンアーキテクチャーに基づいて、mysql2 をラップした DB アクセス層を実装します。この実装により、データベース技術の抽象化とドメインロジックの分離を実現し、将来的な DB 変更やテスタビリティの向上を図ります。

## 目的

1. **DB 技術の抽象化**: mysql2 の実装詳細を隠蔽
2. **テスタビリティ向上**: モックやスタブでのテスト容易性
3. **DB 変更容易性**: 将来的に PostgreSQL 等への切り替えを可能に
4. **ドメインロジックの分離**: ビジネスロジックとデータアクセスの分離

## アーキテクチャ構成

### レイヤー構成

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│      (GraphQL/REST API)            │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         Application Layer           │
│     (Use Cases/Services)           │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│          Domain Layer               │
│  (Entities/Interfaces/Rules)       │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│       Infrastructure Layer          │
│  (Database/External Services)      │
└─────────────────────────────────────┘
```

## 実装すべき機能・コンポーネント

### 1. インターフェース層（Domain Layer）

#### リポジトリインターフェース

- `ISeasoningRepository` - 調味料データアクセスのインターフェース
- `ISeasoningTypeRepository` - 調味料種類データアクセスのインターフェース
- `ISeasoningImageRepository` - 調味料画像データアクセスのインターフェース
- `ISeasoningTemplateRepository` - 調味料テンプレートデータアクセスのインターフェース

#### データベース接続インターフェース

- `IDatabaseConnection` - データベース接続の抽象化
- `ITransaction` - トランザクション管理の抽象化

### 2. 実装層（Infrastructure Layer）

#### MySQL 実装

- `MySQLSeasoningRepository` - mysql2 を使った調味料リポジトリ実装
- `MySQLSeasoningTypeRepository` - mysql2 を使った調味料種類リポジトリ実装
- `MySQLSeasoningImageRepository` - mysql2 を使った調味料画像リポジトリ実装
- `MySQLSeasoningTemplateRepository` - mysql2 を使った調味料テンプレートリポジトリ実装
- `MySQLConnection` - mysql2 接続管理クラス

### 3. ドメインエンティティ

#### エンティティ定義

- `Seasoning` - 調味料エンティティ
- `SeasoningType` - 調味料種類エンティティ
- `SeasoningImage` - 調味料画像エンティティ
- `SeasoningTemplate` - 調味料テンプレートエンティティ

#### バリデーション

- Zod スキーマによる型安全なバリデーション

## ファイル構成

```
src/
├── libs/
│   ├── database/
│   │   ├── interfaces/           # リポジトリインターフェース
│   │   │   ├── ISeasoningRepository.ts
│   │   │   ├── ISeasoningTypeRepository.ts
│   │   │   ├── ISeasoningImageRepository.ts
│   │   │   ├── ISeasoningTemplateRepository.ts
│   │   │   ├── IDatabaseConnection.ts
│   │   │   └── ITransaction.ts
│   │   ├── mysql/               # MySQL実装
│   │   │   ├── connection/
│   │   │   │   ├── MySQLConnection.ts
│   │   │   │   └── MySQLTransaction.ts
│   │   │   ├── repositories/
│   │   │   │   ├── MySQLSeasoningRepository.ts
│   │   │   │   ├── MySQLSeasoningTypeRepository.ts
│   │   │   │   ├── MySQLSeasoningImageRepository.ts
│   │   │   │   └── MySQLSeasoningTemplateRepository.ts
│   │   │   └── types/
│   │   │       └── MySQLTypes.ts
│   │   └── entities/            # ドメインエンティティ
│   │       ├── Seasoning.ts
│   │       ├── SeasoningType.ts
│   │       ├── SeasoningImage.ts
│   │       └── SeasoningTemplate.ts
│   └── di/                      # 依存注入設定
│       └── container.ts
```

## データベーススキーマ対応

### 既存テーブル構造との対応

#### seasoning テーブル

```sql
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(256) NOT NULL,
type_id INT NOT NULL,
image_id INT,
best_before_at DATE,
expires_at DATE,
purchased_at DATE,
created_at DATE NOT NULL,
update_at DATE NOT NULL
```

#### seasoning_type テーブル

```sql
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(256) NOT NULL,
created_at DATE NOT NULL,
update_at DATE NOT NULL
```

#### seasoning_image テーブル

```sql
id INT AUTO_INCREMENT PRIMARY KEY,
folder_uuid CHAR(36) NOT NULL,
filename VARCHAR(50) NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

#### seasoning_template テーブル

```sql
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(256) NOT NULL,
type_id INT NOT NULL,
image_id INT,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

## GraphQL スキーマとの整合性

### 現在の GraphQL スキーマ

```graphql
type Seasoning {
  id: ID!
  name: String!
  quantity: Float
  unit: String
  expirationDate: String
  notes: String
}

type Template {
  id: ID!
  name: String!
  seasonings: [Seasoning!]!
  description: String
}
```

### 対応方針

- GraphQL スキーマとデータベーススキーマの差異を吸収
- DTO パターンを使用してドメインエンティティと GraphQL 型を分離
- 必要に応じて GraphQL スキーマの調整を検討

## 実装手順

### Phase 1: 基盤構築

1. ドメインエンティティの定義
2. リポジトリインターフェースの定義
3. データベース接続の抽象化

### Phase 2: MySQL 実装

4. MySQL 接続管理の実装
5. MySQL リポジトリの実装
6. エラーハンドリングの実装

### Phase 3: 統合・テスト

7. 依存注入コンテナの実装
8. ユニットテストの作成
9. 統合テストの作成

### Phase 4: 移行・統合

10. 既存コードからの移行
11. GraphQL リゾルバーとの統合
12. パフォーマンステストと最適化

## 技術的考慮事項

### エラーハンドリング

- カスタムエラー型の定義
- データベースエラーの抽象化
- ログ戦略の統一

### パフォーマンス

- 接続プールの最適化
- クエリの最適化
- キャッシュ戦略

### セキュリティ

- SQL インジェクション対策
- 入力値のサニタイゼーション
- アクセス制御

### テスト戦略

- ユニットテスト: モック/スタブを使用
- 統合テスト: テスト用データベースを使用
- E2E テスト: 実際のフローを検証

## 想定される課題と対策

### 課題 1: 既存コードとの互換性

**対策**: 段階的な移行とアダプターパターンの使用

### 課題 2: パフォーマンスのオーバーヘッド

**対策**: ベンチマークテストと最適化ポイントの特定

### 課題 3: 複雑性の増加

**対策**: 明確な責任分離と十分なドキュメント

## 成果物

1. **実装済みライブラリ**: 完全に抽象化された DB 層
2. **テストスイート**: 網羅的なテストカバレッジ
3. **ドキュメント**: 使用方法とアーキテクチャガイド
4. **移行ガイド**: 既存コードからの移行手順

## 今後の拡張性

### 他の DB 対応

- PostgreSQL アダプターの追加
- NoDB アダプターの追加
- インメモリ DB アダプターの追加

### 機能拡張

- キャッシュ層の追加
- 読み取り専用レプリカ対応
- 分散データベース対応

---

この実装計画に基づいて、段階的にクリーンアーキテクチャー DB 層を構築していきます。
