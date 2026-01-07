# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

調味料管理 Web アプリケーション - Next.js ベースの調味料在庫管理システム。TypeScript で記述され、MySQL データベースを使用。

## Development Commands

### Setup & Development

```bash
pnpm install              # 依存関係のインストール
pnpm run dev             # 開発サーバー起動 (http://localhost:3000、Turbopack使用)
pnpm run build           # プロダクションビルド
pnpm start               # プロダクションサーバー起動
```

### Testing

```bash
pnpm test                # すべてのテストを実行 (Vitest)
pnpm run test:watch      # ウォッチモードでテスト実行
pnpm run test:coverage   # カバレッジレポート生成
```

#### 部分テスト（例）

```bash
# 単一ファイルを実行（pnpm scripts に引数を渡す）
pnpm run test -- src/infrastructure/database/repositories/mysql/MySQLSeasoningRepository/__tests__/MySQLSeasoningRepository.test.ts

# パターン指定（watch）
pnpm run test:watch -- src/**/MySQLSeasoningRepository.*.test.ts
```

### Quality Checks

```bash
pnpm run lint            # ESLint実行
pnpm run check           # TypeScript型チェック (tsc --noEmit)
```

### Storybook

```bash
pnpm run storybook       # Storybook起動 (port 6006)
pnpm run build-storybook # Storybookビルド
```

## CLI 実行ポリシー（重要）

- npx は使用しないでください。必ず package.json の pnpm scripts を経由してコマンドを実行します。
  - 理由: 半自動インストールによる環境差分の発生、ロックファイルの一貫性低下、CI の再現性劣化を防ぐためです。
  - 必要なコマンドは scripts に追加し、`pnpm run <script> -- [args]` で引数を渡してください。
  - 単発ユーティリティの実行が必要な場合も、scripts に明示的に追加してから実行します。
- npm/yarn は使用禁止です。必ず pnpm を使用してください。

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router (pages & API routes)
│   ├── api/               # APIエンドポイント
│   │   ├── graphql/       # GraphQL API
│   │   ├── openapi/       # OpenAPI/Swagger
│   │   └── seasonings/    # REST API
│   ├── seasoning/         # 調味料機能ページ
│   └── template/          # テンプレート機能ページ
├── components/            # UIコンポーネント
│   ├── elements/         # 基本要素 (buttons, inputs, etc.)
│   └── layouts/          # レイアウトコンポーネント (headers, etc.)
├── features/             # ドメイン別機能モジュール
├── hooks/                # 共通カスタムフック
├── libs/                 # 共有ライブラリ・抽象化層
│   ├── database/         # データベース抽象化 (Domain層)
│   │   ├── entities/     # ドメインエンティティ
│   │   ├── interfaces/   # インターフェース定義
│   │   ├── repositories/ # リポジトリ抽象
│   │   └── connection/   # 接続管理
│   └── di/              # DIコンテナ
├── infrastructure/       # インフラ層実装
│   ├── database/        # データベース具象実装
│   │   ├── mysql/       # MySQL固有実装 (接続、トランザクション、リポジトリ)
│   │   └── interfaces/  # インフラ層インターフェース
│   └── di/             # DI設定
├── constants/           # 定数定義
│   ├── validation/     # バリデーション定数
│   └── database/       # データベース定数
├── types/              # グローバル型定義
└── utils/              # 共有ユーティリティ
```

### Database Architecture (重要)

**2 層アーキテクチャ**: Domain 層 (`libs/database`) と Infrastructure 層 (`infrastructure/database`)

#### Domain 層 (`src/libs/database`)

- **責務**: アプリケーションが依存する抽象化・契約の提供
- **含むもの**: インターフェース、エンティティ、ドメインサービス、例外型
- **禁止事項**: mysql2 などの外部ドライバー依存、具体的なクエリ実装

#### Infrastructure 層 (`src/infrastructure/database`)

- **責務**: Domain 層の抽象を満たす具象実装
- **含むもの**: mysql2 による接続/トランザクション/プール、構成読み取り、具象リポジトリ
- **禁止事項**: ユースケース固有ロジック、UI ロジック、ドメイン知識のハードコード

#### 依存方向の原則

- **一方向依存**: Domain 層は Infrastructure 層に依存しない
- Infrastructure 層が Domain 層のインターフェースを実装
- DI コンテナを使用して具象実装を注入

#### 接続管理

- **現在**: `MySQLConnectionPool` によるプール方式
- DatabaseConnectionManager (シングルトン) がプールを管理
- プールから接続を取得・返却するパターン

### Design Patterns

- **Repository Pattern**: データアクセスの抽象化
- **Singleton Pattern**: DatabaseConnectionManager
- **Factory Pattern**: Repository 生成
- **Adapter Pattern**: mysql2 ライブラリのラップ
- **Companion Object Pattern**: クラスを使用せず、型とファクトリー関数の組み合わせを推奨

## Code Guidelines

### 重要な開発ルール

1. **最初の指示時**: ツール名「get_implementation_workflow」を利用して開発ルールを読み込む
2. **コミット/PR 作成時**: ツール「prompt-mcp-server」でルールを再確認

### TypeScript 規約

- ESLint/Prettier の標準ルールに準拠 (保存時に必ずフォーマット)
- 早期 return を意識した実装
- **マジックナンバー禁止**: 必ず定数を定義
- **クラス禁止**: 関数とオブジェクトを使用
- **型定義**: オブジェクト型は`interface`、それ以外は`type`
- **コンパニオンオブジェクトパターン**を意識

### Import 規約

- **必ず `@` エイリアスを使用**

  ```typescript
  // Good
  import { foo } from "@/libs/database";

  // Bad
  import { foo } from "../../libs/database";
  ```

### 定数管理 (Phase 4 完了)

#### 定数の分類と配置

- **バリデーション関連**: `src/constants/validation/`
  - `nameValidation.ts` - 名前系 (文字数制限)
  - `descriptionValidation.ts` - 説明系
  - `imageValidation.ts` - 画像系 (サイズ制限、バイト換算)
  - `expiryValidation.ts` - 期限系
- **データベース関連**: `src/constants/database/`
  - `connectionLimits.ts` - プール数制限
  - `timeouts.ts` - 接続・クエリタイムアウト
- **システム関連**: `src/constants/`
  - `pagination.ts` - ページサイズ
  - `ui.ts` - ディレイ、その他 UI 定数

#### 統合定数システム

```typescript
// 推奨: 構造化されたアクセス
VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH;
VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_MB;

// 後方互換性あり (将来削除予定)
VALIDATION_CONSTANTS.NAME_MAX_LENGTH;
```

#### 新しい定数追加時のルール

1. 分類を明確にする
2. 適切なファイルに配置
3. JSDoc コメントを追加 (用途と値の説明)
4. 型安全性を確保 (TypeScript 型定義活用)
5. テストを作成
6. 統合ファイルを更新

### テスト規約

- Vitest を使用
- 全定数ファイルでユニットテスト実装
- テストコードでもマジックナンバー除去
- グローバルテスト API 有効 (describe, it, expect)

## Environment Setup

### 環境変数

`.env.example` を参考に `.env` を作成:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=seasoning_management_db
NODE_ENV=development
```

### データベース接続

- 開発環境では `DatabaseConnectionManager.createDevelopmentConnection()` を使用
- 接続プールが自動管理される
- リポジトリは DI コンテナまたはファクトリー関数で生成

## Key Technical Decisions

### データベース層の進化

1. **Phase 1**: 単一接続方式
2. **Phase 2**: コネクションプール方式 (現在)
3. **計画中**: libs/database/mysql の infrastructure/database/mysql への統合

### 現在の課題

- libs と infrastructure の両方にデータベースコードが存在
- 将来的には infrastructure 層に統合予定 (詳細は `docs/database-architecture.md` を参照)

## Important Files

- `.github/copilot-instructions.md` - GitHub Copilot 向けの指示 (コミット/PR 作成時に参照)
- `docs/database-architecture.md` - データベース層の詳細アーキテクチャ
- `docs/database-folder-structure-plan.md` - データベース構造計画
- `tsconfig.json` - TypeScript 設定 (パスエイリアス `@/*` 定義)
- `vitest.config.ts` - テスト設定

## Working with Database

### リポジトリの使用

```typescript
// ファクトリー関数を使用 (推奨)
import { createSeasoningRepository } from "@/libs/database/repositories/factories";

const repository = createSeasoningRepository(connection);

// または DIコンテナを使用
import { getContainer, SERVICE_IDENTIFIERS } from "@/infrastructure/di";

const container = getContainer();
const repository = container.resolve(SERVICE_IDENTIFIERS.SEASONING_REPOSITORY);
```

### 新しいリポジトリの追加

1. `libs/database/interfaces/repositories/` にインターフェース定義
2. `infrastructure/database/mysql/repositories/` に具象実装
3. `libs/database/repositories/factories/` にファクトリー関数追加
4. DI コンテナにバインディング追加 (必要に応じて)
5. テスト作成

## Review Language

**すべてのレビューコメントは日本語で記述**

- 技術用語は適切に日本語化、必要に応じて英語併記
- コード例は英語のまま可
- 絵文字を使用したコミットメッセージ形式に対応
