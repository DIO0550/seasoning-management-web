import { NextRequest, NextResponse } from "next/server";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { RegisterPurchaseUseCase } from "@/features/seasonings/usecases/register-purchase";
import { SeasoningPurchaseErrorCode } from "@/types/api/seasoning/purchase/error-code";
import {
  seasoningPurchaseRequestSchema,
  seasoningPurchaseResponseSchema,
} from "@/types/api/seasoning/purchase/schemas";
import { errorMapper } from "@/utils/api/error-mapper";
import { NotFoundError } from "@/domain/errors";

/**
 * POST /api/seasonings/purchases - 購入調味料を登録
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = seasoningPurchaseRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorCode = SeasoningPurchaseErrorCode.fromValidationError(
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

    const useCase = new RegisterPurchaseUseCase(
      seasoningRepository,
      seasoningTypeRepository,
      seasoningImageRepository
    );

    const result = await useCase.execute(validationResult.data);

    const response = seasoningPurchaseResponseSchema.parse({ data: result });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("[POST /api/seasonings/purchases] Error:", error);
    return handleRegisterPurchaseError(error);
  }
}

const handleRegisterPurchaseError = (error: unknown) => {
  if (error instanceof NotFoundError) {
    if (error.resource === "seasoning-type") {
      return NextResponse.json(
        {
          code: SeasoningPurchaseErrorCode.SEASONING_TYPE_NOT_FOUND,
          message: error.message,
        },
        { status: 404 }
      );
    }

    if (error.resource === "seasoning-image") {
      return NextResponse.json(
        {
          code: SeasoningPurchaseErrorCode.SEASONING_IMAGE_NOT_FOUND,
          message: error.message,
        },
        { status: 404 }
      );
    }

    const { body: notFoundBody } = errorMapper.toHttpResponse(error);
    return NextResponse.json(notFoundBody, { status: 404 });
  }

  if (
    error instanceof Error &&
    (error.message.includes("Invalid date") ||
      error.message.includes("無効な日付形式です"))
  ) {
    return NextResponse.json(
      {
        code: SeasoningPurchaseErrorCode.DATE_INVALID,
        message: error.message,
      },
      { status: 400 }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        code: SeasoningPurchaseErrorCode.INTERNAL_ERROR,
        message: "リクエストボディの解析に失敗しました",
      },
      { status: 400 }
    );
  }

  const { status, body } = errorMapper.toHttpResponse(error);
  return NextResponse.json(body, { status });
};
