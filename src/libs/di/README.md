# 依存注入コンテナ (DI Container) 使用ガイド

## 概要

この DI コンテナは、クリーンアーキテクチャに基づいた依存注入システムを提供します。リポジトリやサービスの依存関係を管理し、型安全な依存注入を実現します。

## 基本的な使用方法

### 1. グローバルコンテナの使用

```typescript
import { getContainer, SERVICE_IDENTIFIERS } from "@/libs/di";
import type { ISeasoningRepository } from "@/libs/database/interfaces/ISeasoningRepository";

// グローバルコンテナからリポジトリを取得
const container = getContainer();
const seasoningRepository: ISeasoningRepository = container.resolve(
  SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
);

// リポジトリを使用
const seasonings = await seasoningRepository.findAll();
```

### 2. 環境別コンテナの作成

```typescript
import { createContainer, Environment } from "@/libs/di";

// 開発環境用コンテナ
const devContainer = createContainer(Environment.DEVELOPMENT);

// 本番環境用コンテナ
const prodContainer = createContainer(Environment.PRODUCTION);

// テスト環境用コンテナ
const testContainer = createContainer(Environment.TEST);
```

### 3. カスタムサービスの登録

```typescript
import { DIContainer, ServiceLifetime } from "@/libs/di";

const container = new DIContainer();

// シングルトンサービスの登録
container.register(
  "MY_SERVICE",
  () => new MyService(),
  ServiceLifetime.SINGLETON
);

// トランジェントサービスの登録
container.register(
  "TEMP_SERVICE",
  () => new TempService(),
  ServiceLifetime.TRANSIENT
);

// サービスの解決
const myService = container.resolve("MY_SERVICE");
```

## 利用可能なサービス識別子

### データベース関連

```typescript
// データベース接続
SERVICE_IDENTIFIERS.DATABASE_CONNECTION;

// 調味料リポジトリ
SERVICE_IDENTIFIERS.SEASONING_REPOSITORY;

// 調味料種類リポジトリ
SERVICE_IDENTIFIERS.SEASONING_TYPE_REPOSITORY;

// 調味料画像リポジトリ
SERVICE_IDENTIFIERS.SEASONING_IMAGE_REPOSITORY;

// 調味料テンプレートリポジトリ
SERVICE_IDENTIFIERS.SEASONING_TEMPLATE_REPOSITORY;
```

## GraphQL リゾルバーでの使用例

```typescript
import { getContainer, SERVICE_IDENTIFIERS } from "@/libs/di";
import type { ISeasoningRepository } from "@/libs/database/interfaces/ISeasoningRepository";

export const seasoningResolvers = {
  Query: {
    seasonings: async () => {
      const container = getContainer();
      const repository: ISeasoningRepository = container.resolve(
        SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
      );

      return await repository.findAll();
    },
  },

  Mutation: {
    createSeasoning: async (_, { input }) => {
      const container = getContainer();
      const repository: ISeasoningRepository = container.resolve(
        SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
      );

      return await repository.create(input);
    },
  },
};
```

## React コンポーネントでの使用例

```typescript
import { useEffect, useState } from "react";
import { getContainer, SERVICE_IDENTIFIERS } from "@/libs/di";
import type { ISeasoningRepository } from "@/libs/database/interfaces/ISeasoningRepository";

export const SeasoningList: React.FC = () => {
  const [seasonings, setSeasonings] = useState([]);

  useEffect(() => {
    const loadSeasonings = async () => {
      const container = getContainer();
      const repository: ISeasoningRepository = container.resolve(
        SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
      );

      const result = await repository.findAll();
      setSeasonings(result.items);
    };

    loadSeasonings();
  }, []);

  return (
    <div>
      {seasonings.map((seasoning) => (
        <div key={seasoning.id}>{seasoning.name}</div>
      ))}
    </div>
  );
};
```

## API Route での使用例

```typescript
// app/api/seasonings/route.ts
import { getContainer, SERVICE_IDENTIFIERS } from "@/libs/di";
import type { ISeasoningRepository } from "@/libs/database/interfaces/ISeasoningRepository";

export async function GET() {
  try {
    const container = getContainer();
    const repository: ISeasoningRepository = container.resolve(
      SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
    );

    const seasonings = await repository.findAll();

    return Response.json(seasonings);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch seasonings" },
      { status: 500 }
    );
  }
}
```

## テストでの使用

```typescript
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { createContainer, resetContainer, Environment } from "@/libs/di";

describe("My Component Test", () => {
  beforeEach(() => {
    resetContainer();
  });

  afterEach(() => {
    resetContainer();
  });

  test("should work with DI container", () => {
    // テスト専用コンテナを作成
    const container = createContainer(Environment.TEST);

    // テストロジック
    expect(container).toBeDefined();
  });
});
```

## エラーハンドリング

```typescript
import { ServiceNotFoundError, CircularDependencyError } from "@/libs/di";

try {
  const service = container.resolve("NON_EXISTENT_SERVICE");
} catch (error) {
  if (error instanceof ServiceNotFoundError) {
    console.error("Service not found:", error.message);
  } else if (error instanceof CircularDependencyError) {
    console.error("Circular dependency detected:", error.message);
  }
}
```

## ベストプラクティス

### 1. シングルトンの使用

リポジトリやサービスはシングルトンとして登録することを推奨します。

```typescript
container.register(
  SERVICE_IDENTIFIERS.SEASONING_REPOSITORY,
  () => new MySQLSeasoningRepository(connection),
  ServiceLifetime.SINGLETON // デフォルト
);
```

### 2. 型安全性の確保

サービス識別子には適切な型を指定しましょう。

```typescript
const SERVICE_ID = Symbol("MyService") as ServiceIdentifier<IMyService>;
```

### 3. 環境別設定

環境に応じて異なる実装を注入できます。

```typescript
// 開発環境: MySQL実装
// テスト環境: モック実装
// 本番環境: 最適化されたMySQL実装
```

### 4. エラーハンドリング

依存関係の解決時には適切なエラーハンドリングを行いましょう。

### 5. テスト時のリセット

テスト間でコンテナ状態を共有しないよう、リセットを行いましょう。

## トラブルシューティング

### 1. サービスが見つからない

```
ServiceNotFoundError: Service not found: Symbol(MyService)
```

- サービスが正しく登録されているか確認
- サービス識別子が正しいか確認

### 2. 循環依存

```
CircularDependencyError: Circular dependency detected: ServiceA -> ServiceB -> ServiceA
```

- 依存関係を見直し、循環を避ける設計に変更
- 必要に応じてファクトリパターンを使用

### 3. 型エラー

TypeScript の型チェックを活用して、コンパイル時に問題を発見しましょう。

```typescript
// 型安全な解決
const repository: ISeasoningRepository = container.resolve(
  SERVICE_IDENTIFIERS.SEASONING_REPOSITORY
);
```
