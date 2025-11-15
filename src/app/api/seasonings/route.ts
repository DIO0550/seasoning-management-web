import { NextRequest, NextResponse } from "next/server";
import { seasoningAddRequestSchema } from "@/types/api/seasoning/add/schemas";
import { SeasoningAddErrorCode } from "@/types/api/seasoning/add/errorCode";
import type { SeasoningAddErrorCode as SeasoningAddErrorCodeType } from "@/types/api/seasoning/add/errorCode";
import type { ErrorResponse } from "@/types/api/common/types";
import {
  SeasoningListQuerySchema,
  type SeasoningListResponse,
  type ErrorResponse as ApiErrorResponse,
} from "@/types/api/seasoning/list/types";
import { SeasoningListErrorCode } from "@/types/api/seasoning/list/errorCode";
import { ConnectionManager } from "@/infrastructure/database/ConnectionManager";
import { RepositoryFactory } from "@/infrastructure/di/RepositoryFactory";
import { ListSeasoningsUseCase } from "@/features/seasonings/usecases/list-seasonings";
import { errorMapper } from "@/utils/api/error-mapper";
import type { SeasoningRecord } from "@/app/api/seasonings/store";
import { seasoningStore } from "@/app/api/seasonings/store";

/**
 * GET /api/seasonings - 調味料一覧を取得
 * OpenAPI仕様に準拠 - UseCaseパターンで実装
 */
export async function GET(request: NextRequest) {
  try {
    // 1. クエリパラメータの取得とバリデーション
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);

    const validationResult = SeasoningListQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      const errorCode = SeasoningListErrorCode.fromValidationError(
        validationResult.error
      );

      const errorResponse: ApiErrorResponse = {
        code: errorCode,
        message: "入力内容を確認してください",
        details: validationResult.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 2. DIコンテナからリポジトリとUseCaseを取得
    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningRepository =
      await repositoryFactory.createSeasoningRepository();
    const useCase = new ListSeasoningsUseCase(seasoningRepository);

    // 3. UseCaseを実行（Input DTOを渡す）
    const output = await useCase.execute(validationResult.data);

    // 4. Output DTOをレスポンス型に変換して返却
    const response: SeasoningListResponse = {
      data: output.data,
      meta: output.meta,
      summary: output.summary,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // 5. Domain例外をHTTPステータスにマッピング
    console.error("調味料一覧取得エラー:", error);
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
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
      const errorCode = SeasoningAddErrorCode.fromValidationError(
        validationResult.error
      );

      const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
        result_code: errorCode,
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { name, seasoningTypeId, image } = validationResult.data;

    // 重複チェック（名前が同じものがないかチェック）
    const existingSeasoning = seasoningStore.findByName(name);
    if (existingSeasoning) {
      const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
        result_code: "DUPLICATE_NAME",
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 新しい調味料を作成
    const newSeasoning: SeasoningRecord = {
      id: `seasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      seasoningTypeId: seasoningTypeId,
      image: image || undefined,
      createdAt: new Date().toISOString(),
    };

    // モックデータに追加
    seasoningStore.add(newSeasoning);

    return NextResponse.json(newSeasoning, { status: 201 });
  } catch (error) {
    console.error("調味料追加エラー:", error);

    // JSON解析エラーなどの場合
    if (error instanceof SyntaxError) {
      const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
        result_code: SeasoningAddErrorCode.INTERNAL_ERROR,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse: ErrorResponse<SeasoningAddErrorCodeType> = {
      result_code: SeasoningAddErrorCode.INTERNAL_ERROR,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
