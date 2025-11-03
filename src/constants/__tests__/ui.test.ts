import { describe, it, expect } from "vitest";
import {
  STORYBOOK_DELAY_SHORT,
  STORYBOOK_DELAY_MEDIUM,
  STORYBOOK_DELAY_LONG,
  STORYBOOK_DELAY_VERY_LONG,
  STORYBOOK_DELAY_EXTRA_LONG,
  TEST_ASYNC_DELAY,
} from "@/constants/ui";

describe("UI constants", () => {
  describe("Storybookディレイ定数", () => {
    it("STORYBOOK_DELAY_SHORTが500msであること", () => {
      expect(STORYBOOK_DELAY_SHORT).toBe(500);
    });

    it("STORYBOOK_DELAY_MEDIUMが1000msであること", () => {
      expect(STORYBOOK_DELAY_MEDIUM).toBe(1000);
    });

    it("STORYBOOK_DELAY_LONGが1500msであること", () => {
      expect(STORYBOOK_DELAY_LONG).toBe(1500);
    });

    it("STORYBOOK_DELAY_VERY_LONGが2000msであること", () => {
      expect(STORYBOOK_DELAY_VERY_LONG).toBe(2000);
    });

    it("STORYBOOK_DELAY_EXTRA_LONGが5000msであること", () => {
      expect(STORYBOOK_DELAY_EXTRA_LONG).toBe(5000);
    });
  });

  describe("テスト用ディレイ定数", () => {
    it("TEST_ASYNC_DELAYが0msであること", () => {
      expect(TEST_ASYNC_DELAY).toBe(0);
    });
  });

  describe("型安全性", () => {
    it("全ての定数がnumber型であること", () => {
      expect(typeof STORYBOOK_DELAY_SHORT).toBe("number");
      expect(typeof STORYBOOK_DELAY_MEDIUM).toBe("number");
      expect(typeof STORYBOOK_DELAY_LONG).toBe("number");
      expect(typeof STORYBOOK_DELAY_VERY_LONG).toBe("number");
      expect(typeof STORYBOOK_DELAY_EXTRA_LONG).toBe("number");
      expect(typeof TEST_ASYNC_DELAY).toBe("number");
    });
  });
});
