import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import { ConnectionManager } from "@/infrastructure/database/ConnectionManager";
import { RepositoryFactory } from "@/infrastructure/di/RepositoryFactory";

// モックの設定
vi.mock("@/infrastructure/database/ConnectionManager");
vi.mock("@/infrastructure/di/RepositoryFactory");

describe("API: /api/seasoning-types", () => {
  const mockSeasoningTypeRepository = {
    findAll: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    existsByName: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSeasoningTypeRepository.existsByName.mockResolvedValue(false);
    (ConnectionManager.getInstance as ReturnType<typeof vi.fn>).mockReturnValue(
      {}
    );
    (
      RepositoryFactory as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(() => ({
      createSeasoningTypeRepository: vi
        .fn()
        .mockResolvedValue(mockSeasoningTypeRepository),
    }));
  });

  describe("GET", () => {
    it("正常系: 調味料種類の一覧を取得できること", async () => {
      const mockData = {
        items: [
          {
            id: 1,
            name: "種類1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: "種類2",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      mockSeasoningTypeRepository.findAll.mockResolvedValue(mockData);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.data[0]).toEqual({ id: 1, name: "種類1" });
    });

    it("異常系: DBエラーが発生した場合、500エラーを返すこと", async () => {
      mockSeasoningTypeRepository.findAll.mockRejectedValue(
        new Error("DB Error")
      );

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.message).toBe("システムエラーが発生しました");
    });
  });

  describe("POST", () => {
    it("正常系: 調味料種類を追加できること", async () => {
      const requestBody = { name: "新しい種類" };
      const request = new NextRequest("http://localhost/api/seasoning-types", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      mockSeasoningTypeRepository.create.mockResolvedValue({ id: 1 });
      mockSeasoningTypeRepository.findById.mockResolvedValue({
        id: 1,
        name: "新しい種類",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data.name).toBe("新しい種類");
    });

    it("異常系: バリデーションエラーの場合、400エラーを返すこと", async () => {
      const requestBody = { name: "" }; // 空文字
      const request = new NextRequest("http://localhost/api/seasoning-types", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe("VALIDATION_ERROR_NAME_REQUIRED");
    });

    it("異常系: DBエラーが発生した場合、500エラーを返すこと", async () => {
      const requestBody = { name: "新しい種類" };
      const request = new NextRequest("http://localhost/api/seasoning-types", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      mockSeasoningTypeRepository.create.mockRejectedValue(
        new Error("DB Error")
      );

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it("異常系: 重複した名前の場合、409エラーを返すこと", async () => {
      const requestBody = { name: "既存の種類" };
      const request = new NextRequest("http://localhost/api/seasoning-types", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      mockSeasoningTypeRepository.existsByName.mockResolvedValue(true);

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.code).toBe("DUPLICATE_ERROR");
    });
  });
});
