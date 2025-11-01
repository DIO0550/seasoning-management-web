/**
 * @fileoverview 調味料の期限ステータス計算のテスト
 * TDD（Test-Driven Development）で実装
 *
 * テスト構造: フラット構造（describeなし）を採用
 * - 各テストは独立して実行可能
 * - 並行実行を活用して高速化
 * - コンパニオンオブジェクトパターンに対応
 */

import { test, expect } from "vitest";
import { calculateDaysUntilExpiry, ExpiryStatusUtils } from "../expiry-status";

// calculateDaysUntilExpiry のテスト
test.concurrent(
  "calculateDaysUntilExpiry - 期限日が未来の場合、正の日数を返す",
  () => {
    const today = new Date("2025-10-20");
    const expiryDate = new Date("2025-10-25");
    const result = calculateDaysUntilExpiry(expiryDate, today);
    expect(result).toBe(5);
  }
);

test.concurrent(
  "calculateDaysUntilExpiry - 期限日が過去の場合、負の日数を返す",
  () => {
    const today = new Date("2025-10-20");
    const expiryDate = new Date("2025-10-15");
    const result = calculateDaysUntilExpiry(expiryDate, today);
    expect(result).toBe(-5);
  }
);

test.concurrent(
  "calculateDaysUntilExpiry - 期限日が当日の場合、0を返す",
  () => {
    const today = new Date("2025-10-20");
    const expiryDate = new Date("2025-10-20");
    const result = calculateDaysUntilExpiry(expiryDate, today);
    expect(result).toBe(0);
  }
);

test.concurrent(
  "calculateDaysUntilExpiry - 期限日がnullの場合、nullを返す",
  () => {
    const today = new Date("2025-10-20");
    const result = calculateDaysUntilExpiry(null, today);
    expect(result).toBeNull();
  }
);

test.concurrent(
  "calculateDaysUntilExpiry - 基準日が省略された場合、今日を基準に計算する",
  () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);
    const result = calculateDaysUntilExpiry(expiryDate);
    expect(result).toBe(10);
  }
);

// fromDays のテスト
test.concurrent(
  "ExpiryStatusUtils.fromDays - 期限まで8日以上ある場合、freshを返す",
  () => {
    const result = ExpiryStatusUtils.fromDays(8);
    expect(result).toBe("fresh");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDays - 期限まで7日の場合、expiring_soonを返す",
  () => {
    const result = ExpiryStatusUtils.fromDays(7);
    expect(result).toBe("expiring_soon");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDays - 期限まで1日の場合、expiring_soonを返す",
  () => {
    const result = ExpiryStatusUtils.fromDays(1);
    expect(result).toBe("expiring_soon");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDays - 期限日当日（0日）の場合、expiredを返す",
  () => {
    const result = ExpiryStatusUtils.fromDays(0);
    expect(result).toBe("expired");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDays - 期限が過去の場合、expiredを返す",
  () => {
    const result = ExpiryStatusUtils.fromDays(-1);
    expect(result).toBe("expired");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDays - 期限がnullの場合、unknownを返す",
  () => {
    const result = ExpiryStatusUtils.fromDays(null);
    expect(result).toBe("unknown");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDays - カスタムの期限切れ間近日数を指定できる",
  () => {
    const result = ExpiryStatusUtils.fromDays(10, {
      expiringSoonThreshold: 14,
    });
    expect(result).toBe("expiring_soon");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDays - カスタムの期限切れ間近日数が15日の場合はfresh",
  () => {
    const result = ExpiryStatusUtils.fromDays(15, {
      expiringSoonThreshold: 14,
    });
    expect(result).toBe("fresh");
  }
);

// fromDate のテスト（統合的なメソッド）
test.concurrent(
  "ExpiryStatusUtils.fromDate - 2025-10-27期限の調味料は7日後でexpiring_soonと判定される",
  () => {
    const today = new Date("2025-10-20");
    const expiryDate = new Date("2025-10-27");
    const status = ExpiryStatusUtils.fromDate(expiryDate, today);
    expect(status).toBe("expiring_soon");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDate - 2025-10-30期限の調味料は10日後でfreshと判定される",
  () => {
    const today = new Date("2025-10-20");
    const expiryDate = new Date("2025-10-30");
    const status = ExpiryStatusUtils.fromDate(expiryDate, today);
    expect(status).toBe("fresh");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDate - 2025-10-19期限の調味料は1日前でexpiredと判定される",
  () => {
    const today = new Date("2025-10-20");
    const expiryDate = new Date("2025-10-19");
    const status = ExpiryStatusUtils.fromDate(expiryDate, today);
    expect(status).toBe("expired");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDate - 期限なしの調味料はunknownと判定される",
  () => {
    const today = new Date("2025-10-20");
    const status = ExpiryStatusUtils.fromDate(null, today);
    expect(status).toBe("unknown");
  }
);

test.concurrent(
  "ExpiryStatusUtils.fromDate - カスタム設定でステータスを判定できる",
  () => {
    const today = new Date("2025-10-20");
    const expiryDate = new Date("2025-10-30");
    const status = ExpiryStatusUtils.fromDate(expiryDate, today, {
      expiringSoonThreshold: 14,
    });
    expect(status).toBe("expiring_soon");
  }
);
