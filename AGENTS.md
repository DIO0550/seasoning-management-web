# Repository Guidelines

- 必ず日本語で応答してください

## 必須ワークフロー & セキュリティ

- **ブランチ**: main ブランチでの作業は禁止。目的に応じた新ブランチを作成してください。
- **CLI**: `npx` は使用せず、必ず `pnpm run <script> -- [args]` 形式で実行してください。npm/yarn は禁止です。
- **セキュリティ**: 機密情報は `.env.local` に限定し、ログ等に残さないでください。
- **Linter**: `eslint-disable` や `any` 型の使用は禁止。コード修正で解決してください。

## プロジェクト構成 & 技術スタック

- **Stack**: Next.js 15 (App Router), TypeScript, Vite, Storybook, Tailwind CSS, MySQL, GraphQL, OpenAPI.
- **ディレクトリ**:
  - UI: `src/app`, `src/components`
  - Logic: `src/features`, `src/domain`
  - Shared: `src/utils`, `src/types`, `src/constants`, `src/config`
  - Data: `src/infrastructure`
  - Docs: `docs/`, `Specification/`, `sql/`

## 開発コマンド

- `pnpm run dev`: 開発サーバー起動
- `pnpm run build` / `start`: ビルド・検証
- `pnpm run lint` / `check`: 静的解析
- `pnpm test`: 単体テスト (部分実行: `pnpm run test -- <path>`)
- `pnpm run storybook`: UI カタログ

## コーディング規約

- **Import**: 相対パス禁止。必ず `@/` エイリアスを使用。
- **命名**: コンポーネント(PascalCase), フック(`useXxx`), 関数(camelCase), ファイル名はケバブケース (`kebab-case.ts`)。
  - **ケバブケース規則**:
    - 英小文字、数字、ハイフン (`-`) のみで構成されます。
    - 単語はハイフンで区切ります。
    - ファイル名の最初と最後は英数字である必要があります。
    - ハイフンは連続して使用できません。
    - 例: `file-name-example.ts`
    - 正規表現: `/^[a-z0-9]+(-[a-z0-9]+)*$/`
- **実装**: クラスより関数を優先。オブジェクト型は `interface`、その他は `type` を使用。コンパニオンオブジェクトパターン推奨。SOLID 原則を遵守。
- **コメント**: 自己文書化コードを心がけ、自明なコメントは禁止。
- **Tailwind**: レイアウト → サイズ → 配色 → 状態 の順で記述。
- **互換性**: 後方互換性は考慮せず、新仕様へ完全移行してください。

## テスト指針

- **配置**: 各モジュール内の `__tests__` ディレクトリに配置（例: `src/features/.../__tests__/file.test.ts`）。
- **ツール**: Vitest + Testing Library。
- **構造**: `describe` の使用は避け、ファイルを分割してフラットな構造を維持。テストケース名は日本語で記述。
- **モック**: 外部依存（API, DB 等）のみモック化し、ロジックは実物を使用。
- **DB テスト**: `src/infrastructure/database/**/__tests__` で実施。

## ドキュメント & 設計

- 実装前後に `docs/`, `Specification/`, `openapi-spec.md` を確認・更新。
- 意思決定は `implementation-plan/` 等に記録。
- バリデーション値は `src/constants/validation/` に集約。

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

## レビューガイドライン

- **言語**: コメントは全て日本語。修正が必要な場合は具体的なコード例を提示。
- **観点**: 命名、構成、テスト、コミット形式など、本ガイドラインの全項目の遵守を確認。

## Codex カスタムコマンド

- `/fix-pr-review <PR番号|URL>`
  - 目的: 指定 PR の未解決レビュー指摘を取得し、修正 → 検証 → コミットまで一連の作業を自動支援する。
  - 手順:
    1. main 以外のブランチで実行していることを確認。
    2. `mcp__github__get_pull_request_review_comments` で未解決コメントを取得し、類似内容はグルーピング。
    3. グループごとに修正を実施し、`pnpm run test -- <対象パス>` / `pnpm run lint -- <対象パス>` など必要最小限の検証を実行（npx 禁止）。
    4. コミット前に `general/commit.prompt.md` を取得してルールを遵守。原則「指摘 1 件=1 コミット」、ただし類似指摘は 1 コミットにまとめて良い。
    5. 失敗した場合は処理を止め、ログと未完リストを出力。
  - 入出力例:
    - 実行: `/fix-pr-review https://github.com/owner/repo/pull/112`
    - 結果: 修正した指摘一覧、実行したテスト、作成コミットを報告。
