# DI コンテナパターンから DB コネクションシングルトンパターンへのリファクタリング

## 📋 タスクの理解と分析

現在のシステムは複雑な DI コンテナパターンを使用していますが、これを簡素化して DB コネ### Phase 4: 既存コードの修正

- [ ] API routes での DI 使用箇所を修正
- [ ] テストファイルでの DI 使用箇所を修正
- [ ] その他サービス層での使用箇所を修正

### Phase 5: DI 関連ファイルの削除

- [ ] DI コンテナ関連ファイルを削除
- [ ] 不要なインポート文の削除
- [ ] 型定義の整理

### Phase 6: テストの修正と検証パターンで管理する方針に変更します。

### 背景

- DI コンテナパターンが複雑になりすぎている
- DB コネクションのシングルトン管理のみで十分
- シンプルな構造でメンテナンス性を向上させる

## 🎯 実装すべき機能・コンポーネントの概要

### 1. データベースコネクション管理

- シングルトンパターンで DB コネクションを管理
- 環境別の接続管理（development, production, test）
- コネクションプールの適切な管理

### 2. テーブル別リポジトリの実装

- 各テーブル（Seasoning、SeasoningType、SeasoningImage、SeasoningTemplate）専用のリポジトリクラス
- コンストラクタで DB コネクションを受け取る設計
- MySQL 固有の実装ではなく、汎用的なリポジトリパターン

### 3. Service 層と UseCase 層の実装

- 関数ベースの Service 層（クラスではなく関数で実装）
- 関数ベースの UseCase 層（ビジネスロジックを関数で実装）
- namespace を使ってオブジェクト風の API を提供
- 依存関係はパラメータとして関数に渡す設計

### 4. 既存 DI 関連コードの削除

- DI コンテナ関連ファイルの削除
- バインディング設定の削除
- 不要な依存関係の整理

## 📁 ファイル構成と変更対象

### 削除予定ファイル

```
src/libs/di/
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
src/libs/database/
├── connection/
│   └── DatabaseConnectionManager.ts - シングルトンDB接続管理
└── repositories/
    ├── SeasoningRepository.ts - 調味料テーブル用リポジトリ
    ├── SeasoningTypeRepository.ts - 調味料種類テーブル用リポジトリ
    ├── SeasoningImageRepository.ts - 調味料画像テーブル用リポジトリ
    └── SeasoningTemplateRepository.ts - 調味料テンプレートテーブル用リポジトリ

src/features/seasoning/
├── services/
│   ├── SeasoningService.ts - 調味料関連のサービス関数群
│   ├── SeasoningTypeService.ts - 調味料種類関連のサービス関数群
│   └── SeasoningImageService.ts - 調味料画像関連のサービス関数群
└── usecases/
    ├── SeasoningUseCase.ts - 調味料関連のユースケース関数群
    └── SeasoningManagementUseCase.ts - 調味料管理のユースケース関数群

src/features/template/
├── services/
│   └── TemplateService.ts - テンプレート関連のサービス関数群
└── usecases/
    └── TemplateUseCase.ts - テンプレート関連のユースケース関数群
```

### 修正ファイル

- リポジトリを使用している箇所すべて
  - API routes
  - テストファイル
  - 各種サービス層

## 🔄 実装手順とステップ

### Phase 1: 新しい DB 接続管理の実装

- [x] シングルトンパターンで DB コネクション管理クラスを作成
- [x] 環境別接続管理機能を実装
- [x] 接続プール管理機能の実装

### Phase 2: テーブル別リポジトリの実装

- [x] 各テーブル専用のリポジトリクラスを作成
- [x] コンストラクタで DB コネクションを受け取る設計実装
- [x] 既存の MySQL リポジトリから汎用リポジトリへの移行

### Phase 3: Service 層と UseCase 層の実装

- [x] 関数ベースの Service 層を実装
- [x] namespace を使ったオブジェクト風 API 設計
- [x] 関数ベースの UseCase 層を実装
- [x] 依存関係注入をパラメータで実現

### Phase 4: 既存コードの修正

- [x] API routes での DI 使用箇所を修正
- [ ] テストファイルでの DI 使用箇所を修正
- [x] その他サービス層での使用箇所を修正

### Phase 5: DI 関連ファイルの削除

- [ ] DI コンテナ関連ファイルを削除
- [ ] 不要なインポート文の削除
- [ ] 型定義の整理

### Phase 6: テストの修正と検証

- [ ] 新しいパターンに対応したテストの修正
- [ ] 全テストの実行と動作確認
- [ ] パフォーマンステストの実行

## 📝 新しいアーキテクチャ設計

### DatabaseConnectionManager（シングルトン）

```typescript
class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connection: IDatabaseConnection | null = null;

  static getInstance(): DatabaseConnectionManager;
  async getConnection(): Promise<IDatabaseConnection>;
  async closeConnection(): Promise<void>;
}
```

### テーブル別リポジトリ（コネクション注入パターン）

```typescript
// 調味料リポジトリ
class SeasoningRepository implements ISeasoningRepository {
  constructor(private readonly connection: IDatabaseConnection) {}

  async findAll(): Promise<Seasoning[]> {
    return await this.connection.query<Seasoning>("SELECT * FROM seasoning");
  }
}

// 調味料種類リポジトリ
class SeasoningTypeRepository implements ISeasoningTypeRepository {
  constructor(private readonly connection: IDatabaseConnection) {}

  async findAll(): Promise<SeasoningType[]> {
    return await this.connection.query<SeasoningType>(
      "SELECT * FROM seasoning_type"
    );
  }
}

// 使用例
const connectionManager = DatabaseConnectionManager.getInstance();
const connection = await connectionManager.getConnection();
const seasoningRepository = new SeasoningRepository(connection);
const seasoningTypeRepository = new SeasoningTypeRepository(connection);
```

### Service 層（関数ベース + namespace）

```typescript
// SeasoningService.ts
import type { IDatabaseConnection } from "@/libs/database/interfaces/IDatabaseConnection";
import { SeasoningRepository } from "@/libs/database/repositories/SeasoningRepository";

type Dependencies = {
  connection: IDatabaseConnection;
};

async function findAll({ connection }: Dependencies): Promise<Seasoning[]> {
  const repository = new SeasoningRepository(connection);
  return await repository.findAll();
}

async function findById(
  id: number,
  { connection }: Dependencies
): Promise<Seasoning | null> {
  const repository = new SeasoningRepository(connection);
  return await repository.findById(id);
}

async function create(
  data: CreateSeasoningData,
  { connection }: Dependencies
): Promise<Seasoning> {
  const repository = new SeasoningRepository(connection);
  return await repository.create(data);
}

// namespaceでオブジェクト風に
export namespace SeasoningService {
  export const findAll = findAll;
  export const findById = findById;
  export const create = create;
}
```

### UseCase 層（関数ベース + namespace）

```typescript
// SeasoningUseCase.ts
import { SeasoningService } from '../services/SeasoningService';
import { SeasoningTypeService } from '../services/SeasoningTypeService';

type Dependencies = {
  connection: IDatabaseConnection;
};

async function createSeasoningWithValidation(
  data: CreateSeasoningRequest,
  { connection }: Dependencies
): Promise<SeasoningResponse> {
  // バリデーション
  if (!data.name || data.name.trim() === '') {
    throw new Error('調味料名は必須です');
  }

  // 調味料種類の存在確認
  const seasoningType = await SeasoningTypeService.findById(data.typeId, { connection });
  if (!seasoningType) {
    throw new Error('指定された調味料種類が見つかりません');
  }

  // 調味料作成
  const seasoning = await SeasoningService.create({
    name: data.name,
    typeId: data.typeId,
    imageId: data.imageId,
    bestBeforeAt: data.bestBeforeAt,
    expiresAt: data.expiresAt,
    purchasedAt: data.purchasedAt,
  }, { connection });

  return {
    id: seasoning.id,
    name: seasoning.name,
    type: seasoningType,
    createdAt: seasoning.createdAt,
  };
}

export namespace SeasoningUseCase {
  export const createWithValidation = createSeasoningWithValidation;
}

## 🧪 テスト戦略

### 単体テスト

- DatabaseConnectionManager のシングルトン動作確認
- 各リポジトリのコンストラクタ注入確認
- モックコネクションを使ったリポジトリテスト

### 統合テスト

- 実際のデータベース接続での動作確認
- API 層からリポジトリ層までの通信確認
- エラーハンドリングの確認

## 📊 期待される効果

### メリット

- ✅ コードの複雑性削減
- ✅ 理解しやすいアーキテクチャ
- ✅ メンテナンス性の向上
- ✅ デバッグの容易さ

### 考慮事項

- ⚠️ リポジトリの直接インスタンス化による結合度の上昇
- ⚠️ テスト時のモック化が少し複雑になる可能性

## ✅ 完了条件

- [ ] 全 DI コンテナ関連コードの削除完了
- [ ] 新しいシングルトンパターンでの動作確認
- [ ] 全テストの正常実行
- [ ] パフォーマンス劣化なし
- [ ] ドキュメントの更新完了

## 🔗 関連ドキュメント

- [Clean Architecture DB Layer](../clean-architecture-db-layer/)
- [MySQL Connection Management](../../src/libs/database/mysql/connection/)
- [Repository Interfaces](../../src/libs/database/interfaces/)
```
