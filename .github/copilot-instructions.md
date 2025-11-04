---
applyTo: "**"
---

# GitHub Copilot Development Guidelines

## 作業開始前の必須手順

- 作業やレビューを始める際は、最初に `prompt-mcp-server` を利用して関連ルール(特に `prompt-mcp-server__get_implementation_workflow`)を確認してください。
- Linter の無効化(`eslint-disable` など)は使用せず、ルール違反は設定やコード修正で解消してください。
- main ブランチで直接作業せず、必ず目的に応じた新しいブランチへ切り替えてください。

## プロジェクト構成とモジュール整理

- Next.js 15 + TypeScript を前提に、UI は `src/app`・`src/components`、機能別ロジックは `src/features`、ドメインモデルは `src/domain` に配置します。
- データアクセスは `src/infrastructure`、共通ユーティリティは `src/utils`、共通型は `src/types` に集約し、インポートは `@/` エイリアスを優先してください。
- 定数と設定値は `src/constants` と `src/config` にまとめ、Storybook 関連は `src/stories`、自動生成物は `coverage/`、SQL は `sql/` へ保存します。
- 仕様や設計は `docs/`・`Specification/`・`openapi-spec.md`、進行中の計画は `implementation-plan/` と `seasoning-management-design-doc.md` を参照します。

## 技術スタック

### フロントエンド

- TypeScript
- Next.js 15 (App Router)
- Vite
- Storybook
- Tailwind CSS
- Prettier / ESLint

### バックエンド

- Next.js (API Routes)
- MySQL
- GraphQL
- OpenAPI / Swagger

## ビルド・テスト・開発コマンド

- `npm run dev`: Turbopack で開発サーバーを起動。
- `npm run build` / `npm run start`: 本番ビルドと検証用サーバーを実行。
- `npm run lint` / `npm run check`: ESLint と TypeScript の静的検証を実施。
- `npm test` / `npm run test:watch` / `npm run test:coverage`: Vitest による単体テスト、ウォッチ、カバレッジ収集。
- `npm run storybook` / `npm run build-storybook`: UI カタログの起動と静的出力。

### テストの部分実行（例）

- 単一/特定テストのみ実行したい場合は、npm scripts に引数を渡す形で実行する
  - 例: `npm run test -- src/infrastructure/database/repositories/mysql/MySQLSeasoningRepository/__tests__/MySQLSeasoningRepository.test.ts`
  - 例: `npm run test:watch -- src/**/MySQLSeasoningRepository.*.test.ts`

## CLI 実行ポリシー

- npx は使用しない。必ず package.json の npm scripts を経由してコマンドを実行する
  - 理由: 半自動インストールによる環境差分の発生、ロックファイルの一貫性低下、CI の再現性劣化を防ぐため
  - 必要なコマンドは scripts に追加し、`npm run <script> -- [args]` で引数を渡す
  - 単発ユーティリティの実行が必要な場合も、scripts に明示的に追加してから実行する

## コーディング規約と命名

- Prettier 互換(2 スペース、ダブルクォート)と `eslint.config.mjs` のルールを守り、保存時に整形します。
- 早期 return を意識し、マジックナンバーは定数へ切り出してください。
- クラスは使用せず、インターフェースは `interface`、その他は `type` を用います。
- コンパニオンオブジェクトパターンを意識して実装すること。
- コンポーネントは PascalCase、フックは `useXxx`、ユーティリティ関数は `camelCase`、ファイルは `kebab-case.ts` で命名します。
- Tailwind クラスはレイアウト → サイズ → 配色 → 状態の順に並べ、ブラウザ API 依存はドメイン層から排除します。
- **後方互換性サポートは基本的に行わない。** リファクタリング時は既存コードを直接更新し、非推奨 API や互換レイヤーを残さないこと。

## import ルール

- 必ず `@/` エイリアスを利用して import すること。
- 相対パスでの import は使用しないこと。

## テスト指針

- **テストファイルの配置**: 各モジュールごとにフォルダを作成し、その中にテスト対象ファイルと `__tests__/` サブディレクトリを配置します。
  - 例: `src/features/seasoning/hooks/use-seasoning-submit/use-seasoning-submit.ts` のテストは `src/features/seasoning/hooks/use-seasoning-submit/__tests__/use-seasoning-submit.test.ts`
  - hooks、services、usecases などの機能単位でフォルダを作成し、その中にファイルとテストを配置します。
  - ファイル名は kebab-case を使用します（例: `use-seasoning-submit.ts`）。
  - これにより、テスト対象とテストが近接し、モジュールごとの責務が明確になります。
- テストは Vitest + Testing Library でシナリオを記述し、ファイル名は `*.test.ts` / `*.test.ts x` とします。
- データベース関連は `src/infrastructure/database/**/__tests__` を参照し、コネクションはモック化して検証します。
- 重要変更は `npm run test:coverage` で 80% 以上の維持を確認し、共通セットアップやモックは `vitest.setup.ts` に集約します。

## コミットとプルリクエスト方針

- コミットは `type: 説明`(必要に応じて絵文字)の Conventional Commits 互換形式を保持し、Issue 連携は本文や末尾に `(#123)` で明記します。
- 1 コミット 1 責務を意識し、生成物や秘密情報は含めません。UI 変更はスクリーンショットを添付してください。
- プルリクエストでは概要、影響範囲、テスト結果(`npm test` + `npm run lint` 等)を記録し、SQL 変更は `sql/` のファイル番号と適用・ロールバック手順を説明します。

## ドキュメントと設計参照

- 実装前後で `docs/`・`Specification/`・`openapi-spec.md` を確認し、差分が生じた場合は同時更新します。
- `implementation-plan.md` と `seasoning-management-design-doc.md` に意思決定や残課題を追記し、ナレッジを共有します。
- README の定数管理ポリシーに従い、バリデーション値は `src/constants/validation/` に集約してください。

## 開発ルールチェックとセキュリティ

- 実装やレビューを始める前に `prompt-mcp-server__get_implementation_workflow` で開発ルールを読み込み、作業中も `prompt-mcp-server` を用いて最新ルールを随時再確認します。
- 機密情報は `.env.local` に限定し、`src/config` の読み取りユーティリティを経由させます。ログや例外へ認証情報を残さないよう注意してください。
- MySQL 設定を変更する際は `src/config/database.ts` と `src/infrastructure/database` の整合を取り、スキーマ変更は `sql/` とドキュメントで告知します。
- 依存更新や大規模変更時は `npm run lint` と `npm test` をセットで実行し、破壊的変更の有無をレビューで共有してください。

## レビュー言語設定

- **すべてのレビューコメントは日本語で記述してください**
- 技術用語は適切に日本語化するか、必要に応じて英語併記してください
- コード例は英語のまま記載して構いません
- 絵文字を使用したコミットメッセージ形式を理解し、適切に評価してください
