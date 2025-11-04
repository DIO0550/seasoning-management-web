# Repository Guidelines

- 必ず日本語で応答してください

## プロジェクト構成とモジュール整理

- Next.js 15 + TypeScript を前提に、UI は `src/app`・`src/components`、機能別ロジックは `src/features`、ドメインモデルは `src/domain` に配置します。
- データアクセスは `src/infrastructure`、共通ユーティリティは `src/utils`、共通型は `src/types` に集約し、インポートは `@/` エイリアスを優先してください。
- 定数と設定値は `src/constants` と `src/config` にまとめ、Storybook 関連は `src/stories`、自動生成物は `coverage/`、SQL は `sql/` へ保存します。
- 仕様や設計は `docs/`・`docs/specification/`・`openapi-spec.md`、進行中の計画は `design/proposals/` と `design/current/` を参照します。

## 作業開始前の必須手順

- 作業やレビューを始める際は、最初に `prompt-mcp-server` を利用して関連ルール（特に `prompt-mcp-server__get_implementation_workflow`）を確認してください。
- Linter の無効化（`eslint-disable` など）は使用せず、ルール違反は設定やコード修正で解消してください。
- main ブランチで直接作業せず、必ず目的に応じた新しいブランチへ切り替えてください。

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

- Prettier 互換 (2 スペース、ダブルクォート) と `eslint.config.mjs` のルールを守り、保存時に整形します。
- 早期 return を意識し、マジックナンバーは定数へ切り出してください。クラスは使用せず、インターフェースは `interface`、その他は `type` を用います。
- 後方互換を目的とした実装は原則として行わず、新仕様への移行を優先してください。
- コンポーネントは PascalCase、フックは `useXxx`、ユーティリティ関数は `camelCase`、ファイルは `kebab-case.ts` で命名します。
- Tailwind クラスはレイアウト → サイズ → 配色 → 状態の順に並べ、ブラウザ API 依存はドメイン層から排除します。

## テスト指針

- **テストファイルの配置**: 各モジュールごとにフォルダを作成し、その中にテスト対象ファイルと `__tests__/` サブディレクトリを配置します。
  - 例: `src/features/seasoning/hooks/use-seasoning-submit/use-seasoning-submit.ts` のテストは `src/features/seasoning/hooks/use-seasoning-submit/__tests__/use-seasoning-submit.test.ts`
  - hooks、services、usecases などの機能単位でフォルダを作成し、その中にファイルとテストを配置します。
  - ファイル名は kebab-case を使用します（例: `use-seasoning-submit.ts`）。
  - これにより、テスト対象とテストが近接し、モジュールごとの責務が明確になります。
- テストは Vitest + Testing Library でシナリオを記述し、ファイル名は `*.test.ts` / `*.test.tsx` とします。
- データベース関連は `src/infrastructure/database/**/__tests__` を参照し、コネクションはモック化して検証します。
- 重要変更は `npm run test:coverage` で 80% 以上の維持を確認し、共通セットアップやモックは `vitest.setup.ts` に集約します。

## コミットとプルリクエスト方針

- コミットは `type: 説明` (必要に応じて絵文字) の Conventional Commits 互換形式を保持し、Issue 連携は本文や末尾に `(#123)` で明記します。
- 1 コミット 1 責務を意識し、生成物や秘密情報は含めません。UI 変更はスクリーンショットを添付してください。
- プルリクエストでは概要、影響範囲、テスト結果 (`npm test` + `npm run lint` 等) を記録し、SQL 変更は `sql/` のファイル番号と適用・ロールバック手順を説明します。

## ドキュメントと設計参照

- 実装前後で `docs/`・`docs/specification/`・`openapi-spec.md` を確認し、差分が生じた場合は同時更新します。
- `implementation-plan.md` と `seasoning-management-design-doc.md` に意思決定や残課題を追記し、ナレッジを共有します。
- README の定数管理ポリシーに従い、バリデーション値は `src/constants/validation/` に集約してください。

## docs/ フォルダ運用ガイド

- ドキュメントはすべて `docs/` に集約し、以下の構成を基準に管理します。
  ```
  docs/
  ├── implementation/          # 実装予定・実装中（WIP）のドキュメント
  │   └── {機能カテゴリ名}/    # 機能単位で柔軟にフォルダを追加
  ├── design/                  # 設計検討中の資料
  │   ├── proposals/           # 提案・検討段階の設計
  │   └── current/             # 採用済みの設計
  ├── completed/               # 実装完了したドキュメント（参照価値あり）
  │   └── {機能カテゴリ名}/
  ├── adr/                     # Architecture Decision Record
  │   └── template.md          # ADR テンプレート
  ├── archive/                 # 参照頻度の低い文書の保管庫
  │   ├── completed/           # 役目を終えた完了ドキュメント
  │   ├── deprecated/          # 非推奨になったドキュメント
  │   └── rejected/            # 却下した提案
  └── guides/                  # 開発ガイドやチュートリアル
  ```
- `implementation/` は実装予定・実装中（WIP）の計画・タスク・仕様のドラフトを配置します。完了後は `completed/` へ必ず移動します。
- `design/` で検討した文書は採用判断をした時点で `design/current/` へ移し、実装が完了したら `completed/` へ移動します（移動履歴と理由を追記）。
- `adr/` は `0001-決定名.md` のように連番で管理し、背景・決定内容・影響範囲を明記します。テンプレートは `adr/template.md` を利用してください。
- 利用しなくなった資料は削除せず `archive/` に移し、冒頭に非推奨または却下の理由と日付を記載します。
- 開発ガイドラインや手順書、チュートリアルは `guides/` に集約し、更新時は関連する実装・設計ドキュメントとの整合を確認します。
- 文書更新は `implementation-plan/` や進捗レポートと連携して行い、意思決定や残課題を必ず記録します。

## 開発ルールチェックとセキュリティ

- 実装やレビューを始める前に `prompt-mcp-server__get_implementation_workflow` で開発ルールを読み込み、作業中も `prompt-mcp-server` を用いて最新ルールを随時再確認します。
- 機密情報は `.env.local` に限定し、`src/config` の読み取りユーティリティを経由させます。ログや例外へ認証情報を残さないよう注意してください。
- MySQL 設定を変更する際は `src/config/database.ts` と `src/infrastructure/database` の整合を取り、スキーマ変更は `sql/` とドキュメントで告知します。
- 依存更新や大規模変更時は `npm run lint` と `npm test` をセットで実行し、破壊的変更の有無をレビューで共有してください。
