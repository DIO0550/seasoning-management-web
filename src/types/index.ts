/**
 * @fileoverview 共通型定義の barrel export
 * 各ドメインの型をここから一括で import できるようにする
 */

// 調味料ドメイン
export * from "./seasoning";

// バリデーション
export * from "./validation";

// 既存の型（後方互換）
export * from "./seasoningType";
export * from "./submitErrorState";
export * from "./validationErrorState";

// API 型は別途 @/types/api から import することを推奨
// 例: import type { SeasoningAddRequest } from "@/types/api/seasoning/add/types";
