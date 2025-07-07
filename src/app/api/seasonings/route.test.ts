import { describe, test, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";

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
        test.each([
          {
            name: "",
            expectedMessage: "調味料名は必須です",
            description: "空文字",
          },
          {
            name: "a".repeat(21),
            expectedMessage: "20文字以内で入力してください",
            description: "21文字（境界値超過）",
          },
          {
            name: "調味料",
            expectedMessage: "半角英数字で入力してください",
            description: "日本語文字",
          },
          {
            name: "salt!",
            expectedMessage: "半角英数字で入力してください",
            description: "記号を含む",
          },
          {
            name: "salt space",
            expectedMessage: "半角英数字で入力してください",
            description: "スペースを含む",
          },
        ])(
          "$description の場合はエラーが返される",
          async ({ name, expectedMessage }) => {
            const request = createRequest({
              name,
              seasoningTypeId: 1,
              image: null,
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe(true);
            expect(data.message).toBe("バリデーションエラーが発生しました");
            expect(data.details?.name).toContain(expectedMessage);
          }
        );
      });

      describe("調味料種類IDのバリデーション", () => {
        test.each([
          {
            seasoningTypeId: null,
            description: "null値",
          },
          {
            seasoningTypeId: undefined,
            description: "undefined",
          },
          {
            seasoningTypeId: 0,
            description: "0（境界値）",
          },
          {
            seasoningTypeId: -1,
            description: "負の数",
          },
          {
            seasoningTypeId: 1.5,
            description: "小数",
          },
        ])(
          "$description の場合はエラーが返される",
          async ({ seasoningTypeId }) => {
            const request = createRequest({
              name: "salt",
              seasoningTypeId,
              image: null,
            });
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe(true);
            expect(data.details?.seasoningTypeId).toContain(
              "調味料の種類を選択してください"
            );
          }
        );
      });
    });

    describe("重複チェック", () => {
      test("同じ名前の調味料は重複作成できない", async () => {
        const seasoningData = {
          name: "pepper",
          seasoningTypeId: 1,
          image: null,
        };

        // 1つ目を作成
        const request1 = createRequest(seasoningData);
        const response1 = await POST(request1);
        expect(response1.status).toBe(201);

        // 同じ名前で2つ目を作成試行
        const request2 = createRequest(seasoningData);
        const response2 = await POST(request2);
        const data2 = await response2.json();

        expect(response2.status).toBe(400);
        expect(data2.error).toBe(true);
        expect(data2.message).toBe("この調味料名は既に登録されています");
        expect(data2.code).toBe("DUPLICATE_NAME");
      });
    });

    describe("リクエスト形式エラー", () => {
      test.each([
        {
          body: "invalid json",
          description: "不正なJSON文字列",
        },
        {
          body: "{}",
          description: "空のJSONオブジェクト",
        },
      ])("$description の場合はエラーが返される", async ({ body }) => {
        const url = "http://localhost:3000/api/seasonings";
        const invalidRequest = new NextRequest(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        const response = await POST(invalidRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(true);
        if (body === "invalid json") {
          expect(data.message).toBe("リクエストの形式が正しくありません");
          expect(data.code).toBe("INVALID_JSON");
        } else {
          expect(data.message).toBe("バリデーションエラーが発生しました");
          expect(data.code).toBe("VALIDATION_ERROR");
        }
      });
    });
  });
});
