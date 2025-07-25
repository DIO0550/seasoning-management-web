# マジックナンバー定数化タスク

## プロジェクト概要

プロジェクト内に散在するマジックナンバーを特定し、適切な定数として管理することで、コードの保守性と可読性を向上させる。

## Phase 1: バリデーション定数の整理

### Task 1.1: 名前バリデーション定数の作成

**Priority**: High  
**Estimated Time**: 2h  
**Dependencies**: None

#### サブタスク

- [x] `src/constants/validation/nameValidation.ts` - 名前系バリデーション定数の作成
- [x] 調味料名の文字数制限定数 (20 文字)
- [x] テンプレート名の文字数制限定数 (20 文字)
- [x] 調味料種類名の文字数制限定数 (50 文字)
- [x] 型定義と JSDoc コメントの追加

#### 受け入れ基準

- [x] 名前系の全てのマジックナンバーが定数化されている
- [x] TypeScript の型安全性が確保されている
- [x] 適切な JSDoc コメントが記述されている
- [x] エクスポート形式が統一されている

---

### Task 1.2: 説明バリデーション定数の作成

**Priority**: High  
**Estimated Time**: 1h  
**Dependencies**: None

#### サブタスク

- [x] `src/constants/validation/descriptionValidation.ts` - 説明系バリデーション定数の作成
- [x] テンプレート説明の文字数制限定数 (200 文字)
- [x] 型定義と JSDoc コメントの追加

#### 受け入れ基準

- [x] 説明系の全てのマジックナンバーが定数化されている
- [x] TypeScript の型安全性が確保されている
- [x] 適切な JSDoc コメントが記述されている

---

### Task 1.3: 画像バリデーション定数の作成

**Priority**: High  
**Estimated Time**: 1h  
**Dependencies**: None

#### サブタスク

- [x] `src/constants/validation/imageValidation.ts` - 画像系バリデーション定数の作成
- [x] 画像サイズ制限定数 (5MB)
- [x] バイト換算定数 (1024)
- [x] 型定義と JSDoc コメントの追加

#### 受け入れ基準

- [x] 画像系の全てのマジックナンバーが定数化されている
- [x] MB・バイト変換の計算が定数化されている
- [x] TypeScript の型安全性が確保されている

---

### Task 1.4: バリデーション定数の適用

**Priority**: High  
**Estimated Time**: 3h  
**Dependencies**: Task 1.1, 1.2, 1.3

#### サブタスク

- [x] `src/features/template/utils/nameValidationMessage.ts` - 新定数の適用
- [x] `src/features/template/utils/descriptionValidationMessage.ts` - 新定数の適用
- [x] `src/utils/seasoningTypeNameValidation.ts` - 新定数の適用
- [x] `src/utils/templateNameValidation.ts` - 新定数の適用
- [x] `src/utils/templateDescriptionValidation.ts` - 新定数の適用
- [x] インポート文の追加と整理

#### 受け入れ基準

- [x] 全対象ファイルでマジックナンバーが除去されている
- [x] 新しい定数が正しくインポートされている
- [x] 既存機能に影響がない
- [x] テストが正常に通る

---

## Phase 2: データベース設定定数の整理

### Task 2.1: データベース接続制限定数の作成

**Priority**: Medium  
**Estimated Time**: 1h  
**Dependencies**: None

#### サブタスク

- [x] `src/constants/database/connectionLimits.ts` - DB 接続制限定数の作成
- [x] 本番環境接続プール数定数 (10)
- [x] 開発環境接続プール数定数 (5)
- [x] テスト環境接続プール数定数 (3)
- [x] 型定義と JSDoc コメントの追加

#### 受け入れ基準

- [x] 全環境の接続プール数が定数化されている
- [x] 環境別設定が明確に分離されている
- [x] TypeScript の型安全性が確保されている

---

### Task 2.2: データベースタイムアウト定数の作成

**Priority**: Medium  
**Estimated Time**: 1h  
**Dependencies**: None

#### サブタスク

- [x] `src/constants/database/timeouts.ts` - タイムアウト関連定数の作成
- [x] 本番環境タイムアウト定数 (60000ms)
- [x] 開発環境タイムアウト定数 (30000ms)
- [x] 型定義と JSDoc コメントの追加

#### 受け入れ基準

- [x] 全タイムアウト値が定数化されている
- [x] 環境別設定が明確に分離されている
- [x] TypeScript の型安全性が確保されている

---

### Task 2.3: データベース設定定数の適用

**Priority**: Medium  
**Estimated Time**: 2h  
**Dependencies**: Task 2.1, 2.2

#### サブタスク

- [x] `src/config/database.ts` - 新定数の適用
- [x] マジックナンバーの置き換え
- [x] インポート文の追加と整理
- [x] 設定の可読性向上

#### 受け入れ基準

- [x] database.ts のマジックナンバーが除去されている
- [x] 新しい定数が正しくインポートされている
- [x] データベース接続が正常に動作する
- [x] 設定の意図が明確になっている

---

## Phase 3: システム定数の整理

### Task 3.1: ページネーション定数の作成

**Priority**: Low  
**Estimated Time**: 1h  
**Dependencies**: None

#### サブタスク

- [x] `src/constants/pagination.ts` - ページネーション定数の作成
- [x] デフォルトページサイズ定数 (10)
- [x] その他ページネーション関連定数
- [x] 型定義と JSDoc コメントの追加

#### 受け入れ基準

- [x] ページネーション関連の定数が整理されている
- [x] TypeScript の型安全性が確保されている
- [x] 将来の拡張性が考慮されている

---

### Task 3.2: その他定数の調査と整理

**Priority**: Low  
**Estimated Time**: 2h  
**Dependencies**: None

#### サブタスク

- [x] プロジェクト全体の追加マジックナンバー調査
- [x] 見つかった定数の分類と整理
- [x] 適切な定数ファイルへの追加
- [x] UI 関連定数ファイル (`src/constants/ui.ts`) の作成
- [x] Repository 層でのページネーション定数適用
- [x] Storybook ディレイ定数の適用
- [x] 文書化

#### 受け入れ基準

- [x] 全てのマジックナンバーが特定されている
- [x] 適切に分類・定数化されている
- [x] 残存するマジックナンバーの理由が文書化されている

---

## Phase 4: 既存定数との統合・最適化

### Task 4.1: 既存 validation.ts との整合性確認

**Priority**: Medium  
**Estimated Time**: 2h  
**Dependencies**: Phase 1 完了

#### サブタスク

- [x] `src/constants/validation.ts` との重複確認
- [x] 統合可能な定数の特定
- [x] 重複排除の実施
- [x] 一貫した命名規則の適用

#### 受け入れ基準

- [x] 重複する定数が排除されている
- [x] 命名規則が統一されている
- [x] 既存機能に影響がない
- [x] インポート先が適切に更新されている

---

### Task 4.2: テストコードの更新

**Priority**: High  
**Estimated Time**: 3h  
**Dependencies**: All previous tasks

#### サブタスク

- [x] テストコード内のマジックナンバー特定
- [x] 新しい定数を使用するようテスト更新
- [x] 定数ファイル自体のユニットテスト作成
- [x] 回帰テストの実行

#### 受け入れ基準

- [x] 全テストが正常に通る
- [x] テストコード内のマジックナンバーが除去されている
- [x] 新しい定数ファイルのテストが作成されている
- [x] テストカバレッジが維持されている

---

### Task 4.3: ドキュメンテーションの更新

**Priority**: Low  
**Estimated Time**: 1h  
**Dependencies**: All previous tasks

#### サブタスク

- [x] README.md の更新（定数管理方針の追加）
- [x] 開発ガイドラインの更新
- [x] 定数追加時のルール策定
- [x] チーム向け説明資料の作成

#### 受け入れ基準

- [x] 定数管理の方針が文書化されている
- [x] 新規定数追加時のガイドラインが明確
- [x] チームメンバーが理解できる説明がある

---

## 総合的な受け入れ基準

### 機能要件

- [x] 全てのマジックナンバーが適切に定数化されている
- [x] 既存機能に破綻的変更がない
- [x] 新しい定数が正しく使用されている

### 非機能要件

- [x] TypeScript エラーがゼロ
- [x] ESLint/Prettier エラーがゼロ
- [x] 全テストが正常に通る
- [x] テストカバレッジが維持されている

### 品質要件

- [x] 定数名が自己説明的である
- [x] 適切な JSDoc コメントが記述されている
- [x] ファイル構成が論理的に整理されている
- [x] 将来の拡張性が考慮されている

---

## リスク管理

### 高リスク項目

1. **既存機能の破綻**: 定数化による予期しない動作変更
2. **テスト更新漏れ**: テストコード内のマジックナンバー更新漏れ
3. **チーム内認識齟齬**: 新しい定数管理方針の理解不足

### 対策

- 段階的実装と小さな単位での確認
- 包括的な回帰テストの実行
- チーム内での事前説明と合意形成

---

## 完了予定

**総予定工数**: 20 時間  
**推定期間**: 1 週間（1 名体制の場合）

各タスクは独立性を保ちつつ、論理的な順序で実行することで、リスクを最小化しながら確実に定数化を進めます。
