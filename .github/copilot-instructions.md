---
applyTo: "**"
---

## **Important 開発ルール**

- 最初の指示時にツール名「get_implementation_workflow」を利用して、開発ルールを読み込むこと

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

## アプリケーションの詳細

- Specification フォルダ内のファイルを参照してください。

## import について

- 必ず「@」エイリアスを利用して、import すること

## レビュー言語設定

- **すべてのレビューコメントは日本語で記述してください**
- 技術用語は適切に日本語化するか、必要に応じて英語併記してください
- コード例は英語のまま記載して構いません
- 絵文字を使用したコミットメッセージ形式を理解し、適切に評価してください
