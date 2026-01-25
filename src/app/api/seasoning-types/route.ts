import { NextRequest, NextResponse } from "next/server";
import { seasoningTypeAddRequestSchema } from "@/types/api/seasoningType/add/schemas";
import { seasoningTypeListResponseSchema } from "@/types/api/seasoningType/list/schemas";
import { SeasoningTypeAddErrorCode } from "@/types/api/seasoningType/add/error-code";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import {
  createContainer,
  INFRASTRUCTURE_IDENTIFIERS,
} from "@/infrastructure/di";
import { errorMapper } from "@/utils/api/error-mapper";
import { DuplicateError, ValidationError } from "@/domain/errors";
import { ConflictError } from "@/libs/database/errors";

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
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (isJsonParseError(error)) {
      return buildInvalidFormatResponse();
    }
    throw error;
  }

  if (!isPlainObject(body)) {
    return buildInvalidFormatResponse();
  }

  const validationResult = seasoningTypeAddRequestSchema.safeParse(body);

  if (!validationResult.success) {
    const errorCode = SeasoningTypeAddErrorCode.fromValidationError(
      validationResult.error,
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
      { status: 400 },
    );
  }

  let container: Awaited<ReturnType<typeof createContainer>> | null = null;

  try {
    container = await createContainer();
    const useCase = container.resolve(
      INFRASTRUCTURE_IDENTIFIERS.CREATE_SEASONING_TYPE_USE_CASE,
    );
    const result = await useCase.execute(validationResult.data);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (isDuplicateNameError(error)) {
      return buildDuplicateNameResponse();
    }

    if (error instanceof ValidationError) {
      return buildDomainValidationErrorResponse(error);
    }

    const { status, body: errorBody } = errorMapper.toHttpResponse(error);

    return NextResponse.json(errorBody, { status });
  } finally {
    container?.clear();
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
    { status: 400 },
  );

const buildInvalidFormatResponse = () =>
  NextResponse.json(
    {
      code: SeasoningTypeAddErrorCode.NAME_INVALID_FORMAT,
      message: "入力内容を確認してください",
    },
    { status: 400 },
  );

const buildDomainValidationErrorResponse = (error: ValidationError) => {
  const code = resolveValidationErrorCode(error);

  return NextResponse.json(
    {
      code,
      message: "入力内容を確認してください",
      details: [
        {
          field: error.field,
          message: error.message,
        },
      ],
    },
    { status: 400 },
  );
};

const resolveValidationErrorCode = (
  error: ValidationError,
): SeasoningTypeAddErrorCode => {
  if (error.message.includes("必須")) {
    return SeasoningTypeAddErrorCode.NAME_REQUIRED;
  }

  if (error.message.includes("文字以内")) {
    return SeasoningTypeAddErrorCode.NAME_TOO_LONG;
  }

  return SeasoningTypeAddErrorCode.NAME_INVALID_FORMAT;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isJsonParseError = (error: unknown): boolean =>
  error instanceof SyntaxError || error instanceof TypeError;
