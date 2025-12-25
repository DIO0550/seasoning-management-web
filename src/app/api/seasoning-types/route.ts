import { NextRequest, NextResponse } from "next/server";
import { seasoningTypeAddRequestSchema } from "@/types/api/seasoningType/add/schemas";
import { seasoningTypeListResponseSchema } from "@/types/api/seasoningType/list/schemas";
import { SeasoningTypeAddErrorCode } from "@/types/api/seasoningType/add/error-code";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { errorMapper } from "@/utils/api/error-mapper";
import { DuplicateError, ValidationError } from "@/domain/errors";
import { ConflictError } from "@/libs/database/errors";
import { MySQLUnitOfWork } from "@/infrastructure/database/unit-of-work/my-sql-unit-of-work";
import { CreateSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/create-seasoning-type";

/**
 * GET /api/seasoning-types
 * 調味料種類の一覧を取得する
 */
export async function GET() {
  try {
    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningTypeRepository =
      await repositoryFactory.createSeasoningTypeRepository();

    const result = await seasoningTypeRepository.findAll();

    const response = {
      data: result.items.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };

    // スキーマで最終確認（実装ミス防止用）
    const parsed = seasoningTypeListResponseSchema.parse(response);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * POST /api/seasoning-types
 * 調味料種類を追加する
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = seasoningTypeAddRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorCode = SeasoningTypeAddErrorCode.fromValidationError(
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
    const unitOfWork = new MySQLUnitOfWork(connectionManager);
    const useCase = new CreateSeasoningTypeUseCase(unitOfWork);
    const result = await useCase.execute(validationResult.data);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (isDuplicateNameError(error)) {
      return buildDuplicateNameResponse();
    }

    if (error instanceof ValidationError) {
      return buildValidationErrorResponse(error);
    }

    const { status, body } = errorMapper.toHttpResponse(error);

    return NextResponse.json(body, { status });
  }
}

const isDuplicateNameError = (error: unknown): boolean =>
  error instanceof DuplicateError || error instanceof ConflictError;

const buildDuplicateNameResponse = () =>
  NextResponse.json(
    {
      code: SeasoningTypeAddErrorCode.DUPLICATE_NAME,
      message: "入力内容を確認してください",
    },
    { status: 409 }
  );

const buildValidationErrorResponse = (error: ValidationError) =>
  NextResponse.json(
    {
      code: SeasoningTypeAddErrorCode.DEFAULT,
      message: "入力内容を確認してください",
      details: [
        {
          field: error.field,
          message: error.message,
        },
      ],
    },
    { status: 400 }
  );
