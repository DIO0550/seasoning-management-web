import { NextRequest, NextResponse } from "next/server";
import { seasoningAddRequestSchema } from "@/types/api/seasoning/add/schemas";
import type { ErrorResponse } from "@/types/api/common/types";
import type { SeasoningAddErrorCode } from "@/types/api/seasoning/add/types";

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
      // バリデーションエラーの種類に応じて適切なエラーコードを決定
      const firstError = validationResult.error.issues[0];
      let errorCode: SeasoningAddErrorCode = "VALIDATION_ERROR_NAME_REQUIRED";

      if (firstError.path.includes("name")) {
        if (firstError.code === "too_small") {
          errorCode = "VALIDATION_ERROR_NAME_REQUIRED";
        } else if (firstError.code === "too_big") {
          errorCode = "VALIDATION_ERROR_NAME_TOO_LONG";
        } else if (firstError.code === "custom") {
          errorCode = "VALIDATION_ERROR_NAME_INVALID_FORMAT";
        }
      } else if (firstError.path.includes("seasoningTypeId")) {
        errorCode = "VALIDATION_ERROR_TYPE_REQUIRED";
      }

      const errorResponse: ErrorResponse<SeasoningAddErrorCode> = {
        result_code: errorCode,
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { name, seasoningTypeId, image } = validationResult.data;

    // 重複チェック（名前が同じものがないかチェック）
    const existingSeasoning = seasonings.find((s) => s.name === name);
    if (existingSeasoning) {
      const errorResponse: ErrorResponse<SeasoningAddErrorCode> = {
        result_code: "DUPLICATE_NAME",
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
      const errorResponse: ErrorResponse<SeasoningAddErrorCode> = {
        result_code: "INTERNAL_ERROR",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse: ErrorResponse<SeasoningAddErrorCode> = {
      result_code: "INTERNAL_ERROR",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
