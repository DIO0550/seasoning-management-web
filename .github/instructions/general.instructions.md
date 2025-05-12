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

```
- src
  ├ app // ルーティング関連
  ├ components
  | ├ elements // ボタンなどの共通のもの
  | | └ buttons
  | |   └ button.tsx
  | └ layouts // 共通のレイアウト関連
  | 　└ headers
  |     └ header.tsx
  ├ features // 機能ごとのフォルダ
  | └ cpu
  |   ├ components // 機能に関連するコンポーネント
  |   ├ hooks // 機能に関するカスタムフック
  |   ├ types // 機能に関する型定義関連
  |   └ utils // 機能に関する関数
  ├ hooks // 共通のカスタムフック
  ├ libs  // ライブラリなど
  ├ types // 型定義関連
  └ utils // アプリ全体で共通して使用する関数関連
```
