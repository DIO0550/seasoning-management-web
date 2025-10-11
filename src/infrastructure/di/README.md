# Infrastructure DI（依存注入）

Infrastructure 層の依存注入設定とコンポジションルート。

## 概要

このディレクトリは、クリーンアーキテクチャに基づいた依存注入の**コンポジションルート**です。

- ドメイン層（`@/libs`）の抽象インターフェースを使用
- インフラストラクチャ層（`@/infrastructure`）の具象実装をバインド
- 依存方向: `infrastructure` → `libs`（正しい方向）

## ファイル構成

```
src/infrastructure/di/
├── identifiers.ts      # サービス識別子定義
├── bindings.ts         # バインディング設定
├── factories.ts        # ファクトリー関数
├── RepositoryFactory.ts # リポジトリファクトリー
├── index.ts            # エクスポート
└── README.md           # このファイル
```

## 使用方法

### 基本的な使用

```typescript
import { DIContainer } from "@/libs/di";
import {
  INFRASTRUCTURE_IDENTIFIERS,
  configureInfrastructureForDevelopment,
} from "@/infrastructure/di";

// 1. コンテナを作成
const container = new DIContainer();

// 2. Infrastructure層のバインディングを設定
await configureInfrastructureForDevelopment(container);

// 3. リポジトリファクトリーを取得
const factory = container.resolve(
  INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY
);

// 4. リポジトリを作成
const seasoningRepo = await factory.createSeasoningRepository();
const typeRepo = await factory.createSeasoningTypeRepository();
```

### API Route での使用例

```typescript
// app/api/seasonings/route.ts
import { DIContainer } from "@/libs/di";
import {
  INFRASTRUCTURE_IDENTIFIERS,
  configureInfrastructureForDevelopment,
} from "@/infrastructure/di";

let container: DIContainer | null = null;

async function getContainer(): Promise<DIContainer> {
  if (!container) {
    container = new DIContainer();
    await configureInfrastructureForDevelopment(container);
  }
  return container;
}

export async function GET() {
  const cont = await getContainer();
  const factory = cont.resolve(INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY);

  const seasoningRepo = await factory.createSeasoningRepository();
  const seasonings = await seasoningRepo.findAll();

  // 接続の解放（プール使用時は自動）
  const provider = cont.resolve(
    INFRASTRUCTURE_IDENTIFIERS.DATABASE_CONNECTION_PROVIDER
  );
  // プールの場合は自動的に解放されるため、明示的な解放は不要

  return Response.json(seasonings);
}
```

### 環境別設定

```typescript
import { env } from "@/config/environment";
import {
  configureInfrastructureForDevelopment,
  configureInfrastructureForProduction,
  configureInfrastructureForTest,
} from "@/infrastructure/di";

// 環境に応じたバインディング
if (env.NODE_ENV === "production") {
  await configureInfrastructureForProduction(container);
} else if (env.NODE_ENV === "test") {
  await configureInfrastructureForTest(container);
} else {
  await configureInfrastructureForDevelopment(container);
}
```

## アーキテクチャ

### 依存関係の流れ

```
┌─────────────────────────────────────────┐
│ API Routes / Application Layer          │
│ (app/api/**, features/**)               │
└───────────────┬─────────────────────────┘
                │ 使用
                ↓
┌─────────────────────────────────────────┐
│ Infrastructure DI                       │
│ (src/infrastructure/di)                 │
│ ・コンポジションルート                    │
│ ・具象実装のバインディング                 │
└───────┬─────────────────────┬───────────┘
        │ 依存                │ 依存
        ↓                     ↓
┌───────────────────┐  ┌────────────────────┐
│ Domain Layer      │  │ Infrastructure     │
│ (libs/database)   │  │ (infrastructure/   │
│ ・インターフェース  │  │  database)         │
│ ・エンティティ      │  │ ・MySQL実装        │
└───────────────────┘  │ ・ConnectionManager│
                       └────────────────────┘
```

### 設計パターン

#### 1. **Factory Pattern**

リポジトリの生成を`RepositoryFactory`に集約:

```typescript
class RepositoryFactory {
  constructor(
    private readonly connectionProvider: IDatabaseConnectionProvider
  ) {}

  async createSeasoningRepository(): Promise<ISeasoningRepository> {
    const connection = await this.connectionProvider.getConnection();
    return new MySQLSeasoningRepository(connection);
  }
}
```

#### 2. **Service Locator Pattern**

DI コンテナを通じてサービスを取得:

```typescript
const factory = container.resolve(
  INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY
);
```

#### 3. **Singleton Pattern**

`ConnectionManager`はシングルトンでプール管理:

```typescript
const manager = ConnectionManager.getInstance();
await manager.initialize(config);
```

## テスト

### モックを使ったテスト

```typescript
import { DIContainer } from "@/libs/di";
import { INFRASTRUCTURE_IDENTIFIERS } from "@/infrastructure/di";
import { MockDatabaseConnectionProvider } from "@/libs/database/__tests__/mocks";

describe("API with DI", () => {
  it("モック接続を使用する", async () => {
    const container = new DIContainer();

    // モックプロバイダーをバインド
    const mockProvider = new MockDatabaseConnectionProvider({
      /* config */
    });

    container.register(
      INFRASTRUCTURE_IDENTIFIERS.DATABASE_CONNECTION_PROVIDER,
      () => mockProvider
    );

    // テスト実行...
  });
});
```

## 移行ガイド

### 旧（libs/di）→ 新（infrastructure/di）

#### Before

```typescript
// ❌ ドメイン層がインフラ実装に依存
import { configureForDevelopment, SERVICE_IDENTIFIERS } from "@/libs/di";

const container = new DIContainer();
configureForDevelopment(container);
const repo = container.resolve(SERVICE_IDENTIFIERS.SEASONING_REPOSITORY);
```

#### After

```typescript
// ✅ 正しい依存方向
import { DIContainer } from "@/libs/di";
import {
  configureInfrastructureForDevelopment,
  INFRASTRUCTURE_IDENTIFIERS,
} from "@/infrastructure/di";

const container = new DIContainer();
await configureInfrastructureForDevelopment(container);
const factory = container.resolve(
  INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY
);
const repo = await factory.createSeasoningRepository();
```

### 主な変更点

1. **非同期初期化**: `await configure...(container)`
2. **ファクトリーパターン**: 直接リポジトリではなくファクトリーを取得
3. **明示的な接続管理**: プロバイダーを通じて接続を管理
4. **型安全性**: 正しいインターフェース型を使用

## ベストプラクティス

### ✅ DO

- Infrastructure 層のバインディングを使用する
- ファクトリーを通じてリポジトリを取得する
- 接続プールを活用する
- 環境ごとに適切なバインディングを選択する

### ❌ DON'T

- ドメイン層からインフラ実装を import しない
- 直接`new MySQLRepository()`しない
- グローバルな接続インスタンスを作らない
- libs/di の非推奨機能を使わない

## トラブルシューティング

### Q: 「Connection manager is not initialized」エラー

A: `configureInfrastructure...`を`await`で呼び出していますか？

```typescript
// ❌ NG
configureInfrastructureForDevelopment(container);

// ✅ OK
await configureInfrastructureForDevelopment(container);
```

### Q: リポジトリが取得できない

A: ファクトリーパターンを使用していますか？

```typescript
// ❌ NG（古い方法）
const repo = container.resolve(INFRASTRUCTURE_IDENTIFIERS.SEASONING_REPOSITORY);

// ✅ OK（新しい方法）
const factory = container.resolve(
  INFRASTRUCTURE_IDENTIFIERS.REPOSITORY_FACTORY
);
const repo = await factory.createSeasoningRepository();
```

### Q: 接続が増え続ける

A: プールを使用し、接続を適切に管理してください。通常、プール使用時は自動で管理されます。

## 参考資料

- [クリーンアーキテクチャ](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [依存性逆転の原則](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [ファクトリーパターン](https://refactoring.guru/design-patterns/factory-method)
