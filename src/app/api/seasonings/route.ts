import { NextRequest, NextResponse } from "next/server";
import { seasoningAddRequestSchema } from "@/types/api/seasoning/add/schemas";
import { SeasoningAddErrorCode } from "@/types/api/seasoning/add/errorCode";
import {
  SeasoningListQuerySchema,
  type SeasoningListResponse,
  type ErrorResponse as ApiErrorResponse,
} from "@/types/api/seasoning/list/types";
import { SeasoningListErrorCode } from "@/types/api/seasoning/list/errorCode";
import { ConnectionManager } from "@/infrastructure/database/ConnectionManager";
import { RepositoryFactory } from "@/infrastructure/di/RepositoryFactory";
import { ListSeasoningsUseCase } from "@/features/seasonings/usecases/list-seasonings";
import { CreateSeasoningUseCase } from "@/features/seasonings/usecases/create-seasoning";
import { errorMapper } from "@/utils/api/error-mapper";
import { DuplicateError, NotFoundError } from "@/domain/errors";

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
    if (process.env.NODE_ENV === "development") {
      console.error("調味料一覧取得エラー:", error);
    } else {
      // 本番環境でもスタックトレースを記録し、ユーザーには公開しない
      console.error("調味料一覧取得エラー:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
    }
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
    const validationResult = seasoningAddRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorCode = SeasoningAddErrorCode.fromValidationError(
        validationResult.error
      );

      return NextResponse.json(
        {
          code: errorCode,
          message: "入力内容を確認してください",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const [
      seasoningRepository,
      seasoningTypeRepository,
      seasoningImageRepository,
    ] = await Promise.all([
      repositoryFactory.createSeasoningRepository(),
      repositoryFactory.createSeasoningTypeRepository(),
      repositoryFactory.createSeasoningImageRepository(),
    ]);

    const useCase = new CreateSeasoningUseCase(
      seasoningRepository,
      seasoningTypeRepository,
      seasoningImageRepository
    );

    const result = await useCase.execute(validationResult.data);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    // エラー内容をログ出力（本番環境のデバッグ・モニタリング用）
    console.error("[POST /api/seasonings] Error:", error);
    return handleCreateSeasoningError(error);
  }
}

const handleCreateSeasoningError = (error: unknown) => {
  if (error instanceof DuplicateError) {
    return NextResponse.json(
      {
        code: SeasoningAddErrorCode.DUPLICATE_NAME,
        message: error.message,
      },
      { status: 409 }
    );
  }

  if (error instanceof NotFoundError) {
    if (error.resource === "SeasoningType") {
      return NextResponse.json(
        {
          code: SeasoningAddErrorCode.SEASONING_TYPE_NOT_FOUND,
          message: error.message,
        },
        { status: 404 }
      );
    }

    if (error.resource === "SeasoningImage") {
      return NextResponse.json(
        {
          code: SeasoningAddErrorCode.SEASONING_IMAGE_NOT_FOUND,
          message: error.message,
        },
        { status: 404 }
      );
    }

    // 想定外の resource の場合も NotFoundError であれば常に 404 を返す
    const { body: notFoundBody } = errorMapper.toHttpResponse(error);
    return NextResponse.json(notFoundBody, { status: 404 });
  }

  // JSON解析エラー（クライアント側のリクエスト不備）
  // TODO: 将来的にはINVALID_REQUEST_BODYなどの専用エラーコードを定義することを検討
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        code: SeasoningAddErrorCode.INTERNAL_ERROR,
        message: "リクエストボディの解析に失敗しました",
      },
      { status: 400 }
    );
  }

  const { status, body } = errorMapper.toHttpResponse(error);
  return NextResponse.json(body, { status });
};
