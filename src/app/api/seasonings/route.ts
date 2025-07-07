import { NextRequest, NextResponse } from "next/server";
import { seasoningAddRequestSchema } from "../../../types/api/seasoning/add/schemas";
import type { ErrorResponse } from "../../../types/api/common/types";

// 調味料の型定義（新しい形式）
interface Seasoning {
  id: string;
  name: string;
  seasoningTypeId: number;
  image?: string;
  createdAt: string;
}

// モックデータ（本来はDBから取得）
export const seasonings: Seasoning[] = [];

/**
 * GET /api/seasonings - 調味料一覧を取得
 */
export async function GET() {
  try {
    return NextResponse.json(seasonings, { status: 200 });
  } catch (error) {
    console.error("調味料一覧取得エラー:", error);
    return NextResponse.json(
      { error: "システムエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seasonings - 新しい調味料を追加
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // zodスキーマでバリデーション
    const validationResult = seasoningAddRequestSchema.safeParse(body);

    if (!validationResult.success) {
      // 詳細なバリデーションエラーを生成
      const details: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        details[path] = issue.message;
      });

      const errorResponse: ErrorResponse = {
        error: true,
        message: "バリデーションエラーが発生しました",
        code: "VALIDATION_ERROR",
        details,
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { name, seasoningTypeId, image } = validationResult.data;

    // 重複チェック（名前が同じものがないかチェック）
    const existingSeasoning = seasonings.find((s) => s.name === name);
    if (existingSeasoning) {
      const errorResponse: ErrorResponse = {
        error: true,
        message: "この調味料名は既に登録されています",
        code: "DUPLICATE_NAME",
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 新しい調味料を作成
    const newSeasoning: Seasoning = {
      id: `seasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      seasoningTypeId: seasoningTypeId,
      image: image || undefined,
      createdAt: new Date().toISOString(),
    };

    // モックデータに追加
    seasonings.push(newSeasoning);

    return NextResponse.json(newSeasoning, { status: 201 });
  } catch (error) {
    console.error("調味料追加エラー:", error);

    // JSON解析エラーなどの場合
    if (error instanceof SyntaxError) {
      const errorResponse: ErrorResponse = {
        error: true,
        message: "リクエストの形式が正しくありません",
        code: "INVALID_JSON",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse: ErrorResponse = {
      error: true,
      message: "システムエラーが発生しました",
      code: "INTERNAL_ERROR",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
