---
applyTo: "**"
---

## ロール定義

- あなたは Next.js の専門家として、モダンなウェブアプリケーション開発のエキスパートです。React、TypeScript、およびサーバーサイドレンダリングの深い知識を持ち、パフォーマンス最適化、SEO 対策、ルーティング設計に精通しています。

## 技術スタック

### フロントエンド

- TypeScript
- NextJs
- Vite
- storybook
- TailWind CSS
- Prettier
- Linter

### バックエンド

- NextJs
- Mysql
- graphql
- OpenAPI
- Swagger
- GraphQL

#### コード規約

- ESLint/Prettier の標準的なルールに準拠すること。
  - ファイルを保存して、フォーマットを必ず行うこと。
- 早期 return を意識した実装にすること。
- マジックナンバーは利用せず、必ず定数を定義すること。
- クラスを使用しないこと
- オブジェクトの型を定義する場合は、interface を使用し、それ以外は type を使用すること。
- コンパニオンオブジェクトパターンを意識して実装すること。

### ディレクトリ構造

```text
/
├ next.config.js
├ tsconfig.json
├ package.json
├ .env.example
├ prisma/                  # Prisma管理のDBスキーマ
│  └ schema.prisma
├ public/
│  └ swagger/             # Swagger UI静的ファイル
│     └ swagger.json
└ src/
   ├ app/                 # Next.js App Routerルート
   │  ├ api/              # APIエンドポイント（REST/GraphQL/OpenAPI）
   │  │  ├ graphql/
   │  │  │  └ route.ts
   │  │  ├ openapi/
   │  │  │  └ route.ts
   │  │  └ …               # 追加のREST APIハンドラ（route.ts）
   │  ├ layout.tsx
   │  └ page.tsx           # トップレベルページ
   ├ components/           # UIコンポーネント
   │  ├ elements/
   │  │  └ buttons/
   │  │     └ button.tsx
   │  └ layouts/
   │     └ headers/
   │        └ header.tsx
   ├ features/             # ドメイン別機能モジュール
   │  └ cpu/
   │     ├ components/
   │     ├ hooks/
   │     ├ types/
   │     └ utils/
   ├ hooks/                # 全体共通カスタムフック
   ├ libs/                 # 共有ライブラリ（GraphQL/OpenAPIクライアント）
   │  ├ graphql/
   │  │  ├ schema.ts
   │  │  └ resolvers.ts
   │  └ openapi/
   ├ types/                # グローバル型定義
   └ utils/                # 共有ユーティリティ関数
```

## コミットルール

- コミットは、以下のルールに従うこと。
  |タイプ|フォーマット|
  |:-|:-|
  |最初のコミット（Initial Commit） |🎉 [Initial Commit]:|
  |新機能（New Feature） |✨ [New Feature]:|
  |バグ修正（Bugfix） |🐛 [Bug fix]: |
  |リファクタリング(Refactoring) |♻️ [Refactaoring]:|
  |デザイン UI/UX(Accessibility) |🎨 [Accessibility]:|
  |パフォーマンス（Performance） |🐎 [Performance]:|
  |テスト（Tests） |🚨 [Tests]:|
  |削除（Removal） |🗑️ [Remove]:|
  |チャットログやドキュメントの更新(Doc)|📖 [Doc]:|
  |WIP(Work In Progress) |🚧 [WIP]:|

## アプリケーションの詳細

- Specification フォルダ内のファイルを参照してください。
