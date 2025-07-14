import { describe, test, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/seasonings/route";

// テスト用のモックリクエスト作成関数
const createRequest = (
  body?: Record<string, unknown>,
  method: string = "POST"
): NextRequest => {
  const url = "http://localhost:3000/api/seasonings";

  if (body) {
    return new NextRequest(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  return new NextRequest(url, { method });
};

// テスト前にデータリセット
beforeEach(async () => {
  // モックデータをクリア
  const { seasonings } = await import("./route");
  seasonings.length = 0;
});

describe("/api/seasonings", () => {
  describe("GET /api/seasonings", () => {
    test.concurrent("調味料一覧を正常に取得できる", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    test.concurrent("空の配列が返される（初期状態）", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe("POST /api/seasonings", () => {
    describe("正常系テスト", () => {
      test.each([
        {
          name: "salt",
          seasoningTypeId: 1,
          image: null,
          description: "基本的な調味料データ",
        },
        {
          name: "sugar123",
          seasoningTypeId: 2,
          image: null,
          description: "半角英数字混合",
        },
        {
          name: "a".repeat(20),
          seasoningTypeId: 3,
          image: null,
          description: "名前20文字（境界値）",
        },
        {
          name: "oil",
          seasoningTypeId: 999,
          image: "data:image/jpeg;base64,validBase64String",
          description: "画像データありの場合",
        },
      ])(
        "$description で調味料を正常に作成できる",
        async ({ name, seasoningTypeId, image }) => {
          const request = createRequest({ name, seasoningTypeId, image });
          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(201);
          expect(data).toMatchObject({
            name,
            seasoningTypeId,
            id: expect.any(String),
            createdAt: expect.any(String),
          });

          if (image) {
            expect(data.image).toBe(image);
          }
        }
      );
    });

    describe("バリデーションエラー", () => {
      describe("名前フィールドのバリデーション", () => {
        test("名前が空の場合、VALIDATION_ERROR_NAME_REQUIREDが返される", async () => {
          const request = createRequest({
            name: "",
            seasoningTypeId: 1,
            image: null,
          });

          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(400);
          expect(data).toEqual({
            result_code: "VALIDATION_ERROR_NAME_REQUIRED",
          });
        });

        test("名前が長すぎる場合、VALIDATION_ERROR_NAME_TOO_LONGが返される", async () => {
          const request = createRequest({
            name: "a".repeat(21), // 21文字
            seasoningTypeId: 1,
            image: null,
          });

          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(400);
          expect(data).toEqual({
            result_code: "VALIDATION_ERROR_NAME_TOO_LONG",
          });
        });

        test("名前の形式が無効な場合、VALIDATION_ERROR_NAME_INVALID_FORMATが返される", async () => {
          const request = createRequest({
            name: "調味料", // 日本語
            seasoningTypeId: 1,
            image: null,
          });

          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(400);
          expect(data).toEqual({
            result_code: "VALIDATION_ERROR_NAME_INVALID_FORMAT",
          });
        });
      });

      describe("調味料種類IDのバリデーション", () => {
        test("調味料種類IDが無効な場合、VALIDATION_ERROR_TYPE_REQUIREDが返される", async () => {
          const request = createRequest({
            name: "salt",
            seasoningTypeId: 0, // 無効な値
            image: null,
          });

          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(400);
          expect(data).toEqual({
            result_code: "VALIDATION_ERROR_TYPE_REQUIRED",
          });
        });
      });
    });

    describe("重複チェック", () => {
      test("重複する名前の場合、DUPLICATE_NAMEが返される", async () => {
        // 最初の調味料を作成
        const request1 = createRequest({
          name: "salt",
          seasoningTypeId: 1,
          image: null,
        });
        await POST(request1);

        // 同じ名前で再作成を試行
        const request2 = createRequest({
          name: "salt",
          seasoningTypeId: 2,
          image: null,
        });

        const response = await POST(request2);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({
          result_code: "DUPLICATE_NAME",
        });
      });
    });

    describe("正常ケース", () => {
      test("正常なデータの場合、調味料が作成される", async () => {
        const request = createRequest({
          name: "salt",
          seasoningTypeId: 1,
          image: null,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toMatchObject({
          name: "salt",
          seasoningTypeId: 1,
          id: expect.any(String),
          createdAt: expect.any(String),
        });
      });
    });
  });
});
