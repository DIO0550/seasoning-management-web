import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useRouter } from "next/navigation";
import { useSeasoningNavigation } from "./useSeasoningNavigation";

// Next.jsのuseRouterをモック化
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockPush = vi.fn();
const mockUseRouter = vi.mocked(useRouter);

describe("useSeasoningNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
  });

  describe("navigateToAdd", () => {
    it("調味料追加画面に遷移できる", () => {
      const { result } = renderHook(() => useSeasoningNavigation());

      act(() => {
        result.current.navigateToAdd();
      });

      expect(mockPush).toHaveBeenCalledWith("/seasoning/add");
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("navigateToList", () => {
    it("調味料一覧画面に遷移できる", () => {
      const { result } = renderHook(() => useSeasoningNavigation());

      act(() => {
        result.current.navigateToList();
      });

      expect(mockPush).toHaveBeenCalledWith("/seasoning/list");
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("戻り値の型チェック", () => {
    it("正しい型のオブジェクトを返す", () => {
      const { result } = renderHook(() => useSeasoningNavigation());

      expect(result.current).toEqual({
        navigateToAdd: expect.any(Function),
        navigateToList: expect.any(Function),
      });
    });

    it("navigateToAdd関数がvoidを返す", () => {
      const { result } = renderHook(() => useSeasoningNavigation());

      const returnValue = result.current.navigateToAdd();

      expect(returnValue).toBeUndefined();
    });

    it("navigateToList関数がvoidを返す", () => {
      const { result } = renderHook(() => useSeasoningNavigation());

      const returnValue = result.current.navigateToList();

      expect(returnValue).toBeUndefined();
    });
  });

  describe("異常系", () => {
    it("router.pushが失敗してもエラーをスローしない", () => {
      mockPush.mockImplementation(() => {
        throw new Error("Navigation failed");
      });

      const { result } = renderHook(() => useSeasoningNavigation());

      expect(() => {
        result.current.navigateToAdd();
      }).not.toThrow();
    });
  });
});
