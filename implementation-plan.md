# DI コンテナパターンから DB コネクションシングルトンパターンへのリファクタリング

## 📋 タスクの理解と分析

現在のシステムで使用されている複雑な DI コンテナパターンを削除し、DB コネクションのみをシングルトンパターンで管理する方針に変更します。

### 背景と目的

- DI コンテナパターンが複雑になりすぎている
- シンプルな DB コネクション管理で十分
- メンテナンス性と理解しやすさの向上

## 🎯 実装すべき機能・コンポーネントの概要

### 1. DatabaseConnectionManager（シングルトンパターン）

- データベース接続をシングルトンパターンで管理
- 環境別の接続管理（development, production, test）
- 接続プールの効率的な管理

### 2. RepositoryFactory

- DI コンテナを使わずにリポジトリインスタンスを生成
- DB コネクションを各リポジトリに注入
- 型安全なファクトリーメソッド提供

### 3. Service 層と UseCase 層

- 関数ベースの Service 層（クラスではなく関数で実装）
- 関数ベースの UseCase 層（ビジネスロジックを関数で実装）
- namespace を使ってオブジェクト風の API を提供
- 依存関係はパラメータとして関数に渡す設計

### 4. 既存 DI 関連コードの完全削除

- DI コンテナ、バインディング、ファクトリーの削除
- 関連するテストファイルの修正
- 不要な依存関係の整理

## 📁 ファイル構成と変更対象

### 削除予定ファイル

```
src/libs/di/ - DIコンテナ関連ディレクトリ全体
├── container.ts - DIコンテナ実装
├── types.ts - DI関連型定義
├── bindings.ts - サービスバインディング設定
├── factories.ts - ファクトリー関数
├── config.ts - DI設定
├── index.ts - エクスポート設定
├── README.md - ドキュメント
└── __tests__/container.test.ts - テストファイル
```

### 新規作成ファイル

```
src/libs/database/connection/
└── DatabaseConnectionManager.ts - シングルトンDB接続管理

src/libs/database/factories/
└── RepositoryFactory.ts - リポジトリファクトリー
```

### 修正ファイル

```
src/app/api/ - 全APIルートファイル
├── seasoning/route.ts
├── seasoning-type/route.ts
└── template/route.ts

src/libs/database/mysql/repositories/ - 全リポジトリテストファイル
├── *.test.ts
└── *.integration.test.ts
```

## 🔄 実装手順とステップ

### Phase 1: 新しい DB 接続管理システムの実装

1. **DatabaseConnectionManager の実装**

   - シングルトンパターンで DB 接続管理
   - 環境別接続設定（development, production, test）
   - 接続プールの効率的管理

2. **RepositoryFactory の実装**
   - DI コンテナを使わないリポジトリ生成
   - 型安全なファクトリーメソッド
   - 依存関係注入ロジック

### Phase 3: Service 層と UseCase 層の実装

3. **関数ベースの Service 層実装**

   - namespace を使ったオブジェクト風 API 設計
   - 依存関係注入をパラメータで実現
   - 各ドメイン別のサービス関数群

4. **関数ベースの UseCase 層実装**
   - ビジネスロジックを関数で実装
   - 複数サービス間の連携処理
   - API 層からのエントリーポイント

### Phase 4: 既存コードの段階的修正

3. **API Routes の修正**

   - DI コンテナ使用箇所を新しいファクトリーパターンに変更
   - エラーハンドリングの確認
   - 統合テストの実行

4. **テストファイルの修正**
   - DI モック使用箇所を新しいモックパターンに変更
   - テストケースの動作確認
   - カバレッジの維持

### Phase 3: DI 関連ファイルの削除

5. **依存関係の完全削除確認**

   - 全ファイルでの DI 使用箇所チェック
   - インポート文の整理

6. **DI コンテナファイルの削除**
   - src/libs/di/ ディレクトリ全体削除
   - ビルドエラーの確認と修正

### Phase 4: 検証とテスト

7. **動作確認**

   - 全テストの実行
   - パフォーマンステスト
   - 本番環境での動作確認

8. **ドキュメント更新**
   - README.md の更新
   - アーキテクチャドキュメントの更新

## 📝 新しいアーキテクチャ設計

### DatabaseConnectionManager（シングルトンパターン）

```typescript
export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connection: IDatabaseConnection | null = null;

  static getInstance(): DatabaseConnectionManager;
  async getConnection(): Promise<IDatabaseConnection>;
  async closeConnection(): Promise<void>;
}
```

### RepositoryFactory（ファクトリーパターン）

```typescript
export class RepositoryFactory {
  static async createSeasoningRepository(): Promise<ISeasoningRepository>;
  static async createSeasoningTypeRepository(): Promise<ISeasoningTypeRepository>;
  static async createSeasoningImageRepository(): Promise<ISeasoningImageRepository>;
  static async createSeasoningTemplateRepository(): Promise<ISeasoningTemplateRepository>;
}
```

### 使用例

````typescript
### 使用例
```typescript
// API Routeでの使用例
export async function GET() {
  const connectionManager = DatabaseConnectionManager.getInstance();
  const connection = await connectionManager.getConnection();

  const result = await SeasoningUseCase.getList({ connection });
  return Response.json(result);
}

export async function POST(request: Request) {
  const data = await request.json();
  const connectionManager = DatabaseConnectionManager.getInstance();
  const connection = await connectionManager.getConnection();

  try {
    const result = await SeasoningUseCase.createWithValidation(data, { connection });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
````

```

## 📊 期待される効果

### メリット

- ✅ システムの複雑性削減
- ✅ 理解しやすいアーキテクチャ
- ✅ メンテナンス性の向上
- ✅ デバッグの容易さ

### 考慮事項

- ⚠️ リポジトリの直接インスタンス化による軽微な結合度上昇
- ⚠️ テスト時のモック化パターンの変更

## ✅ 確認事項と次のステップ

### 実装確認

- DI コンテナパターンからシングルトンパターンへの変更
- DB コネクションのみをシングルトン管理
- リポジトリファクトリーによる依存関係注入

### 次のステップ

1. Phase 1: DatabaseConnectionManager 実装
2. Phase 2: RepositoryFactory 実装
3. Phase 3: 既存コード修正
4. Phase 4: DI 関連ファイル削除
5. Phase 5: テスト修正と検証

この実装計画で進めてよろしいでしょうか？
```
