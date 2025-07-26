# クリーンアーキテクチャー DB 層 実装タスク

## プロジェクト概要

クリーンアーキテクチャーに基づいた mysql2 ラッパー DB 層の実装

## Phase 1: 基盤構築

### Task 1.1: ドメインエンティティの定義

**Priority**: High  
**Estimated Time**: 4h  
**Dependencies**: None

#### サブタスク

- [x] `src/libs/database/entities/Seasoning.ts` - 調味料エンティティ定義
- [x] `src/libs/database/entities/SeasoningType.ts` - 調味料種類エンティティ定義
- [x] `src/libs/database/entities/SeasoningImage.ts` - 調味料画像エンティティ定義
- [x] `src/libs/database/entities/SeasoningTemplate.ts` - 調味料テンプレートエンティティ定義
- [x] Zod スキーマによるバリデーション実装
- [x] DB スキーマとの対応確認

#### 受け入れ基準

- [x] 全エンティティが DB テーブル構造と対応している
- [x] Zod バリデーションが実装されている
- [x] TypeScript の型安全性が確保されている
- [x] ユニットテストが実装されている

---

### Task 1.2: データベース接続インターフェースの定義

**Priority**: High  
**Estimated Time**: 2h  
**Dependencies**: None

#### サブタスク

- [x] `src/libs/database/interfaces/IDatabaseConnection.ts` - DB 接続インターフェース
- [x] `src/libs/database/interfaces/ITransaction.ts` - トランザクションインターフェース
- [x] 接続プール管理のインターフェース定義
- [x] エラーハンドリングの型定義

#### 受け入れ基準

- [x] DB 実装に依存しない抽象的なインターフェース
- [x] トランザクション管理が含まれている
- [x] 適切なエラー型が定義されている

---

### Task 1.3: リポジトリインターフェースの定義

**Priority**: High  
**Estimated Time**: 6h  
**Dependencies**: Task 1.1

#### サブタスク

- [x] `src/libs/database/interfaces/ISeasoningRepository.ts` - 調味料リポジトリ IF
- [x] `src/libs/database/interfaces/ISeasoningTypeRepository.ts` - 調味料種類リポジトリ IF
- [x] `src/libs/database/interfaces/ISeasoningImageRepository.ts` - 調味料画像リポジトリ IF
- [x] `src/libs/database/interfaces/ISeasoningTemplateRepository.ts` - 調味料テンプレートリポジトリ IF
- [x] CRUD 操作の定義
- [x] 検索・フィルタリング機能の定義

#### 受け入れ基準

- [x] 全ての CRUD 操作が定義されている
- [x] 型安全なメソッドシグネチャ
- [ ] GraphQL スキーマとの整合性確認
- [x] インターフェース仕様ドキュメント作成

---

## Phase 2: MySQL 実装

### Task 2.1: MySQL 接続管理の実装

**Priority**: High  
**Estimated Time**: 4h  
**Dependencies**: Task 1.2

#### サブタスク

- [x] `src/libs/database/mysql/connection/MySQLConnection.ts` - 接続管理クラス
- [x] `src/libs/database/mysql/connection/MySQLTransaction.ts` - トランザクション管理
- [x] `src/libs/database/mysql/types/MySQLTypes.ts` - MySQL 固有型定義
- [x] 接続プール設定の統合
- [x] 接続ヘルスチェック機能

#### 受け入れ基準

- [x] mysql2 との統合が完了している
- [x] 接続プールが正常に動作する
- [x] トランザクション管理が実装されている
- [x] エラーハンドリングが実装されている
- [x] ユニットテストが実装されている

---

### Task 2.2: SeasoningRepository の MySQL 実装

**Priority**: High  
**Estimated Time**: 6h  
**Dependencies**: Task 1.3, Task 2.1

#### サブタスク

- [x] `src/libs/database/mysql/repositories/MySQLSeasoningRepository.ts` 実装
- [x] CRUD 操作の実装（create, read, update, delete）
- [x] 検索機能の実装（名前、種類、期限での検索）
- [x] ページネーション機能
- [x] SQL クエリの最適化

#### 受け入れ基準

- [x] 全 CRUD 操作が動作する
- [x] SQL インジェクション対策済み
- [x] エラーハンドリングが適切
- [x] ユニットテストが実装されている
- [x] 統合テストが実装されている

---

### Task 2.3: SeasoningTypeRepository の MySQL 実装

**Priority**: High  
**Estimated Time**: 4h  
**Dependencies**: Task 1.3, Task 2.1

#### サブタスク

- [x] `src/libs/database/mysql/repositories/MySQLSeasoningTypeRepository.ts` 実装
- [x] CRUD 操作の実装
- [x] 名前での検索機能
- [x] 重複チェック機能

#### 受け入れ基準

- [x] 全 CRUD 操作が動作する
- [x] 重複チェックが実装されている
- [x] ユニットテスト・統合テストが完了

---

### Task 2.4: SeasoningImageRepository の MySQL 実装

**Priority**: Medium  
**Estimated Time**: 4h  
**Dependencies**: Task 1.3, Task 2.1

#### サブタスク

- [x] `src/libs/database/mysql/repositories/MySQLSeasoningImageRepository.ts` 実装
- [x] 画像メタデータの CRUD 操作
- [x] UUID 管理機能
- [x] ファイルパス生成機能

#### 受け入れ基準

- [x] 画像メタデータ管理が動作する
- [x] UUID 生成・管理が正常動作
- [x] ユニットテスト・統合テストが完了

---

### Task 2.5: SeasoningTemplateRepository の MySQL 実装

**Priority**: Medium  
**Estimated Time**: 5h  
**Dependencies**: Task 1.3, Task 2.1, Task 2.2

#### サブタスク

- [x] `src/libs/database/mysql/repositories/MySQLSeasoningTemplateRepository.ts` 実装
- [x] テンプレートの CRUD 操作
- [x] 調味料との関連付け機能
- [x] テンプレート検索機能

#### 受け入れ基準

- [x] テンプレート管理が動作する
- [ ] 調味料との関連が正常動作
- [x] ユニットテスト・統合テストが完了

---

## Phase 3: 統合・テスト

### Task 3.1: 依存注入コンテナの実装

**Priority**: High  
**Estimated Time**: 3h  
**Dependencies**: All Phase 2 tasks

#### サブタスク

- [ ] `src/libs/di/container.ts` - DI コンテナ実装
- [ ] インターフェースと実装のマッピング
- [ ] 環境別設定管理
- [ ] シングルトン管理

#### 受け入れ基準

- [ ] 全リポジトリが適切に注入される
- [ ] 環境別設定が動作する
- [ ] 循環依存が発生しない

---

### Task 3.2: 包括的テストスイートの作成

**Priority**: High  
**Estimated Time**: 8h  
**Dependencies**: All Phase 2 tasks

#### サブタスク

- [ ] ユニットテスト（モック使用）の拡充
- [ ] 統合テスト（テスト DB 使用）の実装
- [ ] パフォーマンステストの実装
- [ ] テストカバレッジ 90%以上の達成

#### 受け入れ基準

- [ ] 全リポジトリのテストが実装されている
- [ ] テストカバレッジが 90%以上
- [ ] CI/CD パイプラインでテストが実行される

---

### Task 3.3: エラーハンドリングとログ戦略の実装

**Priority**: Medium  
**Estimated Time**: 4h  
**Dependencies**: All Phase 2 tasks

#### サブタスク

- [ ] カスタムエラー型の定義
- [ ] エラーマッピング機能
- [ ] 構造化ログの実装
- [ ] エラー通知機能

#### 受け入れ基準

- [ ] 適切なエラー分類がされている
- [ ] ログが構造化されている
- [ ] エラー追跡が可能

---

## Phase 4: 移行・統合

### Task 4.1: GraphQL リゾルバーとの統合

**Priority**: High  
**Estimated Time**: 6h  
**Dependencies**: Task 3.1

#### サブタスク

- [ ] GraphQL リゾルバーの更新
- [ ] DTO パターンの実装
- [ ] スキーマとエンティティのマッピング
- [ ] パフォーマンス最適化

#### 受け入れ基準

- [ ] GraphQL API が正常動作する
- [ ] 既存機能が破綻しない
- [ ] パフォーマンスが改善または維持される

---

### Task 4.2: 既存コードからの段階的移行

**Priority**: Medium  
**Estimated Time**: 8h  
**Dependencies**: Task 4.1

#### サブタスク

- [ ] 移行戦略の文書化
- [ ] アダプターパターンの実装
- [ ] 段階的移行の実行
- [ ] 既存機能の検証

#### 受け入れ基準

- [ ] 既存機能が全て移行される
- [ ] 破綻的変更が発生しない
- [ ] パフォーマンスが維持される

---

### Task 4.3: ドキュメントとガイドの作成

**Priority**: Medium  
**Estimated Time**: 4h  
**Dependencies**: All tasks

#### サブタスク

- [ ] アーキテクチャドキュメント
- [ ] 使用方法ガイド
- [ ] トラブルシューティングガイド
- [ ] パフォーマンスチューニングガイド

#### 受け入れ基準

- [ ] 開発者が理解できるドキュメント
- [ ] 運用に必要な情報が網羅されている

---

## 総合的な受け入れ基準

### 機能要件

- [ ] 全リポジトリが正常に動作する
- [ ] GraphQL API が期待通りに動作する
- [ ] 既存機能が破綻しない

### 非機能要件

- [ ] テストカバレッジ 90%以上
- [ ] レスポンス時間が既存と同等以上
- [ ] メモリ使用量が適切な範囲内

### 品質要件

- [ ] TypeScript エラーがゼロ
- [ ] ESLint/Prettier エラーがゼロ
- [ ] セキュリティ脆弱性がゼロ

---

## リスク管理

### 高リスク項目

1. **パフォーマンス劣化**: 定期的なベンチマークテスト実施
2. **既存機能の破綻**: 段階的移行と十分なテスト
3. **複雑性の増加**: 明確な責任分離と文書化

### 対策

- 各 Phase 終了時の品質チェックポイント設置
- 継続的インテグレーションでの自動テスト
- コードレビューの徹底

---

## 完了予定

**総予定工数**: 68 時間  
**推定期間**: 2-3 週間（2 名体制の場合）

各タスクは独立性を保ちつつ、依存関係を明確にすることで、並行作業や段階的実装を可能にしています。
