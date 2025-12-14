import { expect, test, vi, afterEach } from "vitest";
import { getTodayJstDateString } from "@/utils/date-conversion";

afterEach(() => {
  vi.useRealTimers();
});

test("JST基準の今日をYYYY-MM-DDで返す", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-12-14T00:30:00.000Z")); // 2025-12-14 09:30 JST

  expect(getTodayJstDateString()).toBe("2025-12-14");
});

test("UTC日付が前日でもJSTで日付が跨ぐ場合はJSTの今日を返す", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-12-13T15:30:00.000Z")); // 2025-12-14 00:30 JST

  expect(getTodayJstDateString()).toBe("2025-12-14");
});
