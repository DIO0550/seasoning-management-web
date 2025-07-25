# seasoning-management-web

調味料管理アプリケーション

## 概要

このアプリケーションは調味料の在庫管理を支援するための Web アプリケーションです。

## 技術スタック

- フロントエンド: Next.js, TypeScript, TailwindCSS
- バックエンド: Next.js API Routes, GraphQL, OpenAPI
- データベース: MySQL (予定)

## 開発環境のセットアップ

### 前提条件

- Node.js (v20.x 以上)
- npm (v10.x 以上)

### インストール方法

1. リポジトリをクローン

```bash
git clone https://github.com/DIO0550/seasoning-management-web.git
cd seasoning-management-web
```

2. 依存関係のインストール

```bash
npm install
```

3. 開発サーバーの起動

```bash
npm run dev
```

4. ブラウザで http://localhost:3000 にアクセス

### テストの実行

テストには Vitest を使用しています。

```bash
# すべてのテストを実行
npm test

# テストをウォッチモードで実行
npm run test:watch

# テストカバレッジレポートの生成
npm run test:coverage
```

## 機能

- 調味料の一覧表示、追加、編集、削除
- 調味料テンプレートの作成と管理
- その他の機能（開発中）

## 開発ガイドライン

### 定数管理方針（Phase 4 完了版）

本プロジェクトでは、マジックナンバーを避け、適切な定数管理を行うため以下の方針を採用しています。

#### 定数の分類と配置

- **バリデーション関連定数**: `src/constants/validation/`
  - 名前系: `nameValidation.ts` (文字数制限)
  - 説明系: `descriptionValidation.ts` (文字数制限)
  - 画像系: `imageValidation.ts` (サイズ制限、バイト換算)
- **データベース関連定数**: `src/constants/database/`
  - 接続制限: `connectionLimits.ts` (プール数制限)
  - タイムアウト: `timeouts.ts` (接続・クエリタイムアウト)
- **システム関連定数**: `src/constants/`
  - ページネーション: `pagination.ts` (ページサイズ)
  - UI 設定: `ui.ts` (ディレイ、その他 UI 定数)

#### 統合定数システム

統合アクセス用ファイル `src/constants/validation.ts` により、すべてのバリデーション定数を一箇所から参照可能：

```typescript
// 推奨: 新しい構造化されたアクセス
VALIDATION_CONSTANTS.NAME.SEASONING_NAME_MAX_LENGTH;
VALIDATION_CONSTANTS.IMAGE.IMAGE_MAX_SIZE_MB;
VALIDATION_CONSTANTS.DESCRIPTION.TEMPLATE_DESCRIPTION_MAX_LENGTH;

// 後方互換性あり（将来削除予定）
VALIDATION_CONSTANTS.NAME_MAX_LENGTH;
VALIDATION_CONSTANTS.IMAGE_MAX_SIZE_MB;
```

#### Phase 4 完了項目

✅ **Task 4.1**: 既存 validation.ts との整合性確認・統合完了  
✅ **Task 4.2**: テストコード内のマジックナンバー除去完了  
✅ **Task 4.3**: ドキュメンテーション更新完了

#### 品質保証

- 全定数ファイルでユニットテスト実装済み
- テストコードでもマジックナンバー除去済み
- TypeScript 型安全性確保済み
- ESLint/Prettier 準拠済み

#### 新しい定数追加時のルール

1. **分類を明確にする**: バリデーション、データベース、UI 等
2. **適切なファイルに配置**: 既存の分類に従う
3. **JSDoc コメントを追加**: 用途と値の説明を記述
4. **型安全性を確保**: TypeScript の型定義を活用
5. **テストを作成**: 定数ファイルのユニットテストを追加
6. **統合ファイルを更新**: 必要に応じて統合用定数ファイルを更新

#### 例: 新しいバリデーション定数の追加

```typescript
// src/constants/validation/emailValidation.ts
/**
 * メールアドレスの最大文字数制限
 */
export const EMAIL_MAX_LENGTH = 254;

export const EMAIL_VALIDATION_CONSTANTS = {
  EMAIL_MAX_LENGTH,
} as const;

export type EmailValidationConstants = typeof EMAIL_VALIDATION_CONSTANTS;
```

#### マジックナンバー検出と除去

- 定期的にコードレビューでマジックナンバーをチェック
- テストコードでも定数を使用し、保守性を向上
- 計算に使用する値も定数化（例: `BYTES_PER_KB = 1024`）

## ライセンス

MIT License

## コパイロットのレビューを日本語にする

```
<!-- I want to review in Japanese. -->
```
