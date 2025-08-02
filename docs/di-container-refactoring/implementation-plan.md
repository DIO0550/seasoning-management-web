# DI コンテナ削除とシングルトンパターン実装計画

## 🎯 実装目標

複雑な DI コンテナパターンを削除し、DB コネクションのシングルトンパターンに変更することで、システムの複雑性を削減し、メンテナンス性を向上させる。

## 📋 Phase 1: 新しい DB 接続管理システムの実装

### 1.1 DatabaseConnectionManager の実装

**ファイル**: `src/libs/database/connection/DatabaseConnectionManager.ts`

```typescript
/**
 * データベース接続をシングルトンパターンで管理
 */
export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connection: IDatabaseConnection | null = null;
  private readonly config: ConnectionConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  public async getConnection(): Promise<IDatabaseConnection> {
    if (!this.connection) {
      this.connection = await this.createConnection();
    }
    return this.connection;
  }

  private async createConnection(): Promise<IDatabaseConnection> {
    // 環境に応じた接続生成ロジック
  }

  public async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
    }
  }

  private loadConfig(): ConnectionConfig {
    // 環境変数から設定読み込み
  }
}
```

### 1.2 環境別接続管理

**機能要件**:

- Development 環境: ローカル MySQL 接続
- Production 環境: 本番 MySQL 接続
- Test 環境: インメモリまたはテスト用 DB 接続

**実装内容**:

```typescript
private async createConnection(): Promise<IDatabaseConnection> {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'development':
      return this.createDevelopmentConnection();
    case 'production':
      return this.createProductionConnection();
    case 'test':
      return this.createTestConnection();
    default:
      throw new Error(`Unsupported environment: ${env}`);
  }
}
```

## 📋 Phase 2: テーブル別リポジトリの実装

### 2.1 コネクション注入パターンのリポジトリ実装

**ファイル**: `src/libs/database/repositories/SeasoningRepository.ts`

```typescript
/**
 * 調味料テーブル専用リポジトリ
 * コンストラクタでDBコネクションを受け取る
 */
export class SeasoningRepository implements ISeasoningRepository {
  constructor(private readonly connection: IDatabaseConnection) {}

  async findAll(): Promise<Seasoning[]> {
    const result = await this.connection.query<Seasoning>(
      "SELECT * FROM seasoning ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async findById(id: number): Promise<Seasoning | null> {
    const result = await this.connection.query<Seasoning>(
      "SELECT * FROM seasoning WHERE id = ?",
      [id]
    );
    return result.rows[0] || null;
  }

  async create(
    seasoning: Omit<Seasoning, "id" | "createdAt" | "updatedAt">
  ): Promise<Seasoning> {
    const result = await this.connection.query<Seasoning>(
      "INSERT INTO seasoning (name, type_id, image_id, best_before_at, expires_at, purchased_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        seasoning.name,
        seasoning.typeId,
        seasoning.imageId,
        seasoning.bestBeforeAt,
        seasoning.expiresAt,
        seasoning.purchasedAt,
      ]
    );
    return this.findById(result.insertId);
  }
}
```

### 2.2 その他のテーブル別リポジトリ

各テーブルに対応するリポジトリクラスを作成：

- **SeasoningTypeRepository**: 調味料種類テーブル用
- **SeasoningImageRepository**: 調味料画像テーブル用
- **SeasoningTemplateRepository**: 調味料テンプレートテーブル用

## 📋 Phase 3: Service 層と UseCase 層の実装

### 3.1 関数ベースの Service 層

**ファイル**: `src/features/seasoning/services/SeasoningService.ts`

```typescript
/**
 * 調味料関連のサービス関数群
 * namespaceを使ってオブジェクト風のAPIを提供
 */
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

  // バリデーション
  if (!data.name || data.name.trim() === "") {
    throw new Error("調味料名は必須です");
  }

  return await repository.create(data);
}

async function update(
  id: number,
  data: UpdateSeasoningData,
  { connection }: Dependencies
): Promise<Seasoning | null> {
  const repository = new SeasoningRepository(connection);

  // 存在確認
  const existing = await repository.findById(id);
  if (!existing) {
    return null;
  }

  return await repository.update(id, data);
}

async function deleteById(
  id: number,
  { connection }: Dependencies
): Promise<boolean> {
  const repository = new SeasoningRepository(connection);
  return await repository.deleteById(id);
}

// namespaceでオブジェクト風にエクスポート
export namespace SeasoningService {
  export const findAll = findAll;
  export const findById = findById;
  export const create = create;
  export const update = update;
  export const deleteById = deleteById;
}
```

### 3.2 関数ベースの UseCase 層

**ファイル**: `src/features/seasoning/usecases/SeasoningUseCase.ts`

```typescript
/**
 * 調味料関連のユースケース関数群
 * ビジネスロジックと複数サービスの連携を管理
 */
import { SeasoningService } from "../services/SeasoningService";
import { SeasoningTypeService } from "../services/SeasoningTypeService";
import { SeasoningImageService } from "../services/SeasoningImageService";

type Dependencies = {
  connection: IDatabaseConnection;
};

async function createSeasoningWithValidation(
  data: CreateSeasoningRequest,
  { connection }: Dependencies
): Promise<SeasoningResponse> {
  // 1. 入力バリデーション
  if (!data.name || data.name.trim() === "") {
    throw new Error("調味料名は必須です");
  }

  // 2. 調味料種類の存在確認
  const seasoningType = await SeasoningTypeService.findById(data.typeId, {
    connection,
  });
  if (!seasoningType) {
    throw new Error("指定された調味料種類が見つかりません");
  }

  // 3. 画像が指定されている場合の処理
  let imageId: number | null = null;
  if (data.imageData) {
    const image = await SeasoningImageService.uploadImage(data.imageData, {
      connection,
    });
    imageId = image.id;
  }

  // 4. 調味料作成
  const seasoning = await SeasoningService.create(
    {
      name: data.name,
      typeId: data.typeId,
      imageId: imageId,
      bestBeforeAt: data.bestBeforeAt,
      expiresAt: data.expiresAt,
      purchasedAt: data.purchasedAt || new Date(),
    },
    { connection }
  );

  // 5. レスポンス形式に変換
  return {
    id: seasoning.id,
    name: seasoning.name,
    type: {
      id: seasoningType.id,
      name: seasoningType.name,
    },
    imageUrl: imageId ? `/api/images/${imageId}` : null,
    bestBeforeAt: seasoning.bestBeforeAt,
    expiresAt: seasoning.expiresAt,
    purchasedAt: seasoning.purchasedAt,
    createdAt: seasoning.createdAt,
  };
}

async function getSeasoningList({
  connection,
}: Dependencies): Promise<SeasoningListResponse> {
  const seasonings = await SeasoningService.findAll({ connection });

  return {
    items: seasonings.map((seasoning) => ({
      id: seasoning.id,
      name: seasoning.name,
      typeId: seasoning.typeId,
      expiresAt: seasoning.expiresAt,
      isExpired: seasoning.expiresAt ? new Date() > seasoning.expiresAt : false,
    })),
    total: seasonings.length,
  };
}

// namespaceでオブジェクト風にエクスポート
export namespace SeasoningUseCase {
  export const createWithValidation = createSeasoningWithValidation;
  export const getList = getSeasoningList;
}
```

    switch (type) {
      case "seasoning":
        return new MySQLSeasoningRepository(connection) as RepositoryMap[T];
      case "seasoningType":
        return new MySQLSeasoningTypeRepository(connection) as RepositoryMap[T];
      case "seasoningImage":
        return new MySQLSeasoningImageRepository(
          connection
        ) as RepositoryMap[T];
      case "seasoningTemplate":
        return new MySQLSeasoningTemplateRepository(
          connection
        ) as RepositoryMap[T];
      default:
        throw new Error(`Unknown repository type: ${type}`);
    }

}
}

````

## 📋 Phase 4: API Routes の修正

### 4.1 現在の DI 使用パターン

```typescript
// 削除対象のパターン
const container = DIContainer.getInstance();
const repository = container.resolve<ISeasoningRepository>(
  SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
);
````

### 4.2 新しい UseCase/Service パターン

```typescript
// 新しいパターン - UseCaseを使用
import { DatabaseConnectionManager } from "@/libs/database/connection/DatabaseConnectionManager";
import { SeasoningUseCase } from "@/features/seasoning/usecases/SeasoningUseCase";

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
    const result = await SeasoningUseCase.createWithValidation(data, {
      connection,
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

### 4.3 API Route の修正例

**Before** (`src/app/api/seasoning/route.ts`):

```typescript
import { container } from "@/libs/di";

export async function GET() {
  const repository = container.resolve<ISeasoningRepository>(
    SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
  );
  const seasonings = await repository.findAll();
  return Response.json(seasonings);
}
```

**After**:

```typescript
import { DatabaseConnectionManager } from "@/libs/database/connection/DatabaseConnectionManager";
import { SeasoningUseCase } from "@/features/seasoning/usecases/SeasoningUseCase";

export async function GET() {
  const connectionManager = DatabaseConnectionManager.getInstance();
  const connection = await connectionManager.getConnection();

  const result = await SeasoningUseCase.getList({ connection });
  return Response.json(result);
}
```

### 3.3 API Route の修正例

**Before** (`src/app/api/seasoning/route.ts`):

```typescript
import { container } from "@/libs/di";

export async function GET() {
  const repository = container.resolve<ISeasoningRepository>(
    SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
  );
  // ...
}
```

**After**:

```typescript
import { RepositoryFactory } from "@/libs/database/factories/RepositoryFactory";

export async function GET() {
  const repository = await RepositoryFactory.createSeasoningRepository();
  // ...
}
```

## 📋 Phase 4: テストファイルの修正

### 4.1 現在のテストパターン

```typescript
// 削除対象
const mockContainer = new DIContainer();
mockContainer.register(
  SERVICE_IDENTIFIERS.SEASONING_REPOSITORY,
  () => mockRepository
);
```

### 4.2 新しいテストパターン

```typescript
// Mock DatabaseConnectionManager
jest.mock("@/libs/database/connection/DatabaseConnectionManager");
const mockConnectionManager =
  DatabaseConnectionManager.getInstance as jest.MockedFunction<
    typeof DatabaseConnectionManager.getInstance
  >;

// Mock RepositoryFactory
jest.mock("@/libs/database/factories/RepositoryFactory");
const mockRepositoryFactory =
  RepositoryFactory.createSeasoningRepository as jest.MockedFunction<
    typeof RepositoryFactory.createSeasoningRepository
  >;

beforeEach(() => {
  mockRepositoryFactory.mockResolvedValue(mockRepository);
});
```

## 📋 Phase 5: DI 関連ファイルの削除

### 5.1 削除対象ファイル一覧

```
src/libs/di/
├── container.ts ❌
├── types.ts ❌
├── bindings.ts ❌
├── factories.ts ❌
├── config.ts ❌
├── index.ts ❌
├── README.md ❌
└── __tests__/container.test.ts ❌
```

### 5.2 削除手順

1. **依存関係の確認**

   ```bash
   grep -r "from.*di" src/
   grep -r "import.*di" src/
   ```

2. **段階的削除**

   - まず使用箇所を新しいパターンに修正
   - その後、DI 関連ファイルを削除

3. **インポート文の整理**
   - 不要なインポート文の削除
   - 新しいインポート文の追加

## 📋 Phase 6: パフォーマンステスト

### 6.1 ベンチマーク指標

- **接続時間**: DB 接続確立までの時間
- **クエリ実行時間**: 各種クエリの実行時間
- **メモリ使用量**: アプリケーション起動時のメモリ使用量
- **スループット**: API リクエスト処理能力

### 6.2 テスト項目

1. **シングルトン接続の動作確認**

   - 複数リクエスト間での接続共有
   - 接続プールの効率的利用

2. **リポジトリファクトリーの性能**

   - インスタンス生成時間
   - メモリ使用効率

3. **全体的なパフォーマンス**
   - API レスポンス時間
   - 同時接続数の処理能力

## 📊 実装チェックリスト

### Phase 1: DB 接続管理

- [ ] DatabaseConnectionManager 実装
- [ ] 環境別接続設定
- [ ] エラーハンドリング実装
- [ ] 単体テスト作成

### Phase 2: リポジトリファクトリー

- [ ] RepositoryFactory 実装
- [ ] 型安全なファクトリーメソッド
- [ ] 依存関係注入ロジック
- [ ] 単体テスト作成

### Phase 3: API Routes 修正

- [ ] 全 API Route の DI 削除
- [ ] 新しいファクトリーパターン適用
- [ ] エラーハンドリング確認
- [ ] 統合テスト実行

### Phase 4: テスト修正

- [ ] 全テストファイルの DI 削除
- [ ] 新しいモックパターン適用
- [ ] テストケース動作確認
- [ ] カバレッジ確認

### Phase 5: DI 削除

- [ ] 使用箇所の完全削除確認
- [ ] DI ファイル削除
- [ ] インポート文整理
- [ ] ビルドエラー確認

### Phase 6: 検証

- [ ] 全テスト実行
- [ ] パフォーマンステスト
- [ ] 本番環境での動作確認
- [ ] ドキュメント更新

## 🚀 実装開始

実装を開始する準備が整いました。Phase 1 から順次実装を進めていきます。
