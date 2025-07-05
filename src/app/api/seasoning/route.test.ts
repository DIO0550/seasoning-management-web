import { describe, test, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, seasonings } from "./route";

// テスト用のヘルパー関数
const createMockRequest = (
  body?: Record<string, unknown>,
  method: string = "POST"
): NextRequest => {
  const url = "http://localhost:3000/api/seasoning";

  if (body) {
    return new NextRequest(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  return new NextRequest(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

describe("/api/seasoning", () => {
  // モックデータをテスト毎にリセット
  beforeEach(() => {
    // 配列をクリア
    seasonings.length = 0;
  });

  describe("GET /api/seasoning", () => {
    test("調味料一覧を正常に取得できる", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    test("空の配列が返される（初期状態）", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe("POST /api/seasoning", () => {
    test("有効なデータで調味料を正常に作成できる", async () => {
      const requestBody = {
        name: "salt",
        type: "salt",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        name: "salt",
        type: "salt",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
      });
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("createdAt");
    });

    test("画像なしでも調味料を作成できる", async () => {
      const requestBody = {
        name: "sugar",
        type: "sugar",
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        name: "sugar",
        type: "sugar",
      });
      expect(data.image).toBeUndefined();
    });

    describe("バリデーションエラー", () => {
      test("名前が空の場合はエラーが返される", async () => {
        const requestBody = {
          name: "",
          type: "salt",
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("バリデーションエラーが発生しました");
        expect(data.details.name).toBe("調味料名は必須です");
      });

      test("名前が20文字を超える場合はエラーが返される", async () => {
        const requestBody = {
          name: "a".repeat(21), // 21文字
          type: "salt",
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.details.name).toBe(
          "調味料名は20文字以内で入力してください"
        );
      });

      test("名前が半角英数字以外の場合はエラーが返される", async () => {
        const requestBody = {
          name: "調味料名",
          type: "salt",
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.details.name).toBe(
          "調味料名は半角英数字で入力してください"
        );
      });

      test("調味料の種類が空の場合はエラーが返される", async () => {
        const requestBody = {
          name: "salt",
          type: "",
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.details.type).toBe("調味料の種類を選択してください");
      });

      test("無効な調味料の種類の場合はエラーが返される", async () => {
        const requestBody = {
          name: "salt",
          type: "invalid_type",
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.details.type).toBe("有効な調味料の種類を選択してください");
      });

      test("画像形式が正しくない場合はエラーが返される", async () => {
        const requestBody = {
          name: "salt",
          type: "salt",
          image: "invalid_image_data",
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.details.image).toBe("画像形式が正しくありません");
      });

      test("複数のバリデーションエラーが同時に返される", async () => {
        const requestBody = {
          name: "",
          type: "",
          image: "invalid_image",
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.details).toHaveProperty("name");
        expect(data.details).toHaveProperty("type");
        expect(data.details).toHaveProperty("image");
      });
    });

    test("同じ名前の調味料は重複作成できない", async () => {
      // 1つ目の調味料を作成
      const requestBody1 = {
        name: "salt1",
        type: "salt",
      };

      const request1 = createMockRequest(requestBody1);
      const response1 = await POST(request1);

      if (response1.status !== 201) {
        const errorData = await response1.json();
        console.log("First creation failed:", errorData);
      }

      expect(response1.status).toBe(201);

      // 同じ名前で2つ目を作成試行
      const requestBody2 = {
        name: "salt1",
        type: "pepper",
      };

      const request2 = createMockRequest(requestBody2);
      const response2 = await POST(request2);
      const data2 = await response2.json();

      expect(response2.status).toBe(400);
      expect(data2.details.name).toBe("この調味料名は既に登録されています");
    });

    test("不正なJSONの場合はエラーが返される", async () => {
      const url = "http://localhost:3000/api/seasoning";
      const invalidRequest = new NextRequest(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "invalid json",
      });

      const response = await POST(invalidRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("リクエストの形式が正しくありません");
    });
  });

  describe("Edge Cases", () => {
    test("有効な調味料の種類がすべて使用できる", async () => {
      const validTypes = [
        "salt",
        "sugar",
        "pepper",
        "vinegar",
        "soySauce",
        "other",
      ];

      for (const type of validTypes) {
        const requestBody = {
          name: `test${type}`,
          type: type,
        };

        const request = createMockRequest(requestBody);
        const response = await POST(request);

        expect(response.status).toBe(201);
      }
    });

    test("名前の前後の空白は自動的にトリムされる", async () => {
      const requestBody = {
        name: "  salt123  ",
        type: "salt",
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);

      if (response.status !== 201) {
        const errorData = await response.json();
        console.log("Trim test failed:", errorData);
      }

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe("salt123");
    });
  });
});
