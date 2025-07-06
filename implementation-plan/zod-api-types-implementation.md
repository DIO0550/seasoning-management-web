# Zod 導入と API 型管理統一 実装計画

## 概要

zod ライブラリを導入し、入力制限の強化とクライアント・サーバー間での API 型管理の統一を行う。

## タスクの理解と分析

1. **zod ライブラリの導入**: 入力の制限とバリデーションの強化
2. **API 型管理の統一**: クライアント側とサーバー側の型を一箇所で管理
3. **型安全性の向上**: zod スキーマから型を自動生成して型安全性を確保

## 実装すべき機能・コンポーネントの概要

### 1. zod スキーマの定義

- 調味料（seasoning）関連のスキーマ（操作別）
- テンプレート（template）関連のスキーマ（操作別）
- API リクエスト/レスポンス用のスキーマ
- 共通スキーマ（エラーレスポンス等）

### 2. 型定義の統一

- 操作別の API 型定義
- zod スキーマから型の自動生成

### 3. 既存バリデーションの移行

- 既存の utils 配下のバリデーション関数を zod に移行

## ファイル構成と変更対象

```
src/
├ types/
│  ├ api/                    # API関連の型とスキーマ
│  │  ├ common/              # 共通スキーマ・型
│  │  │  ├ schemas.ts        # 共通zodスキーマ（エラーレスポンス等）
│  │  │  └ types.ts          # 共通型定義
│  │  ├ seasoning/           # 調味料API用
│  │  │  ├ add/              # 調味料追加API用
│  │  │  │  ├ schemas.ts     # 追加用zodスキーマ
│  │  │  │  └ types.ts       # 追加API型定義
│  │  │  ├ list/             # 調味料一覧API用
│  │  │  │  ├ schemas.ts     # 一覧用zodスキーマ
│  │  │  │  └ types.ts       # 一覧API型定義
│  │  │  └ [id]/             # 調味料詳細・更新・削除API用（将来的に）
│  │  │     ├ schemas.ts
│  │  │     └ types.ts
│  │  └ template/            # テンプレートAPI用
│  │     ├ add/              # テンプレート追加API用
│  │     │  ├ schemas.ts
│  │     │  └ types.ts
│  │     ├ list/             # テンプレート一覧API用
│  │     │  ├ schemas.ts
│  │     │  └ types.ts
│  │     └ [id]/             # テンプレート詳細・更新・削除API用（将来的に）
│  │        ├ schemas.ts
│  │        └ types.ts
│  ├ seasoningType.ts        # 既存（必要に応じて更新）
│  └ ...
├ utils/                     # 既存のバリデーション関数を更新
└ app/api/                   # 各APIルートでの型利用
   ├ seasoning/
   │  ├ add/
   │  ├ list/
   │  └ [id]/
   └ template/
      ├ add/
      ├ list/
      └ [id]/
```

## この構成の利点

1. **操作毎の関心分離**: add/list 等の操作毎にスキーマが分離される
2. **API ルートとの対応**: `app/api/`の構造と完全に一致
3. **スケーラビリティ**: 将来的な CRUD 操作の追加に対応しやすい
4. **型の粒度**: 各操作で必要な型だけを定義できる
5. **保守性**: 特定の操作に関する変更が他に影響しにくい

## 実装手順とステップ

### ステップ 1: 環境準備

- [ ] zod ライブラリのインストール
- [ ] 新しいブランチの作成
- [ ] TDD 関連プロンプトの取得

### ステップ 2: 共通スキーマの作成

- [ ] `src/types/api/common/schemas.ts` の作成
  - エラーレスポンススキーマ
  - 共通バリデーションルール
- [ ] `src/types/api/common/types.ts` の作成
  - 共通型定義

### ステップ 3: 調味料 API 用スキーマ定義

- [ ] `src/types/api/seasoning/add/schemas.ts` の作成
  - 調味料追加リクエストスキーマ
  - 調味料追加レスポンススキーマ
- [ ] `src/types/api/seasoning/add/types.ts` の作成
- [ ] `src/types/api/seasoning/list/schemas.ts` の作成
  - 調味料一覧取得レスポンススキーマ
- [ ] `src/types/api/seasoning/list/types.ts` の作成

### ステップ 4: テンプレート API 用スキーマ定義

- [ ] `src/types/api/template/add/schemas.ts` の作成
  - テンプレート追加リクエストスキーマ
  - テンプレート追加レスポンススキーマ
- [ ] `src/types/api/template/add/types.ts` の作成
- [ ] `src/types/api/template/list/schemas.ts` の作成
  - テンプレート一覧取得レスポンススキーマ
- [ ] `src/types/api/template/list/types.ts` の作成

### ステップ 5: 各 API ルートでの利用

- [ ] `app/api/seasoning/add/` でのスキーマ利用
- [ ] `app/api/seasoning/list/` でのスキーマ利用
- [ ] `app/api/template/add/` でのスキーマ利用
- [ ] `app/api/template/list/` でのスキーマ利用

### ステップ 6: 既存コードの移行

- [ ] 既存バリデーション関数の zod 移行
  - `utils/formValidation.ts`
  - `utils/imageValidation.ts`
  - `utils/nameValidation.ts`
  - その他バリデーション関数
- [ ] フォームコンポーネントでの zod スキーマ利用
- [ ] カスタムフックでの zod スキーマ利用

### ステップ 7: テストの更新

- [ ] 新しい zod スキーマのテスト作成
- [ ] 既存のバリデーションテストの更新
- [ ] API エンドポイントのテスト更新

## 技術要件

### 使用ライブラリ

- `zod`: スキーマバリデーションと型生成
- 既存の技術スタック（TypeScript, Next.js 等）

### コード規約遵守

- ESLint/Prettier の標準ルールに準拠
- 早期 return を意識した実装
- マジックナンバーの禁止、定数定義の徹底
- クラスを使用せず、interface と type の適切な使い分け
- コンパニオンオブジェクトパターンの活用

## 開発手法

- **TDD（テスト駆動開発）** で実装
- Red → Green → Refactor のサイクル遵守
- 先にテストを書いてから実装コードを作成

## 完了条件

- [ ] zod ライブラリが正しくインストールされている
- [ ] 全ての API 操作に対してスキーマと型が定義されている
- [ ] 既存のバリデーション関数が zod に移行されている
- [ ] クライアント・サーバー間で型が統一されている
- [ ] 全てのテストが通過している
- [ ] コード規約に準拠している

## 注意事項

- 既存の機能に影響を与えないよう段階的に移行する
- 型の変更による影響範囲を十分に確認する
- パフォーマンスの劣化がないか検証する
