/**
 * @fileoverview Repositories エクスポート設定
 * リポジトリファクトリ関数を一元的にエクスポート
 *
 * @deprecated 各リポジトリクラスは削除されました。Infrastructure層の具象実装を使用してください。
 */

// リポジトリ生成関数（Infrastructure層から再エクスポート）
export {
  createSeasoningRepository,
  createSeasoningTypeRepository,
  createSeasoningImageRepository,
  createSeasoningTemplateRepository,
} from "@/infrastructure/database/repositories/factories";
