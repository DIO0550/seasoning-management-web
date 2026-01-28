import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { GetSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/get-seasoning-type";
import { seasoningTypeDetailResponseSchema } from "@/types/api/seasoningType/detail/schemas";
import {
  seasoningTypeUpdateRequestSchema,
  seasoningTypeUpdateResponseSchema,
} from "@/types/api/seasoningType/update/schemas";
import { SeasoningTypeUpdateErrorCode } from "@/types/api/seasoningType/update/error-code";
import { errorMapper } from "@/utils/api/error-mapper";
import {
  DuplicateError,
  NotFoundError,
  ValidationError,
} from "@/domain/errors";
import { ConflictError } from "@/libs/database/errors";
import {
  createContainer,
  INFRASTRUCTURE_IDENTIFIERS,
} from "@/infrastructure/di";

const paramsSchema = z.object({
  typeId: z.coerce.number().int().positive(),
});

const updateParamsSchema = paramsSchema;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ typeId: string }> },
) {
  try {
    const resolvedParams = await params;
    const validationResult = paramsSchema.safeParse(resolvedParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          code: "INVALID_PARAMETER",
          message: "無効なパラメータです",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const { typeId } = validationResult.data;

    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningTypeRepository =
      await repositoryFactory.createSeasoningTypeRepository();

    const useCase = new GetSeasoningTypeUseCase(seasoningTypeRepository);
    const output = await useCase.execute({ typeId });

    const response = seasoningTypeDetailResponseSchema.parse({ data: output });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ typeId: string }> },
) {
  const resolvedParams = await params;
  const validationResult = paramsSchema.safeParse(resolvedParams);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        code: "INVALID_PARAMETER",
        message: "無効なパラメータです",
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
      INFRASTRUCTURE_IDENTIFIERS.DELETE_SEASONING_TYPE_USE_CASE,
    );
    await useCase.execute({ typeId: validationResult.data.typeId });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  } finally {
    container?.clear();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ typeId: string }> },
) {
  const resolvedParams = await params;
  const paramsValidation = updateParamsSchema.safeParse({
    typeId: resolvedParams.typeId,
  });

  if (!paramsValidation.success) {
    const errorCode = SeasoningTypeUpdateErrorCode.fromValidationError(
      paramsValidation.error,
    );

    return NextResponse.json(
      {
        code: errorCode,
        message: "入力内容を確認してください",
        details: paramsValidation.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 },
    );
  }

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

  const bodyValidation = seasoningTypeUpdateRequestSchema.safeParse(body);

  if (!bodyValidation.success) {
    const errorCode = SeasoningTypeUpdateErrorCode.fromValidationError(
      bodyValidation.error,
    );

    return NextResponse.json(
      {
        code: errorCode,
        message: "入力内容を確認してください",
        details: bodyValidation.error.errors.map((err) => ({
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
      INFRASTRUCTURE_IDENTIFIERS.UPDATE_SEASONING_TYPE_USE_CASE,
    );
    const result = await useCase.execute({
      typeId: paramsValidation.data.typeId,
      ...bodyValidation.data,
    });

    const response = seasoningTypeUpdateResponseSchema.parse({ data: result });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (isDuplicateNameError(error)) {
      return buildDuplicateNameResponse();
    }

    if (error instanceof NotFoundError) {
      return buildNotFoundResponse();
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
      code: SeasoningTypeUpdateErrorCode.DUPLICATE_NAME,
      message: "入力内容を確認してください",
    },
    { status: 400 },
  );

const buildNotFoundResponse = () =>
  NextResponse.json(
    {
      code: SeasoningTypeUpdateErrorCode.SEASONING_TYPE_NOT_FOUND,
      message: "対象の調味料種類が見つかりません",
    },
    { status: 404 },
  );

const buildInvalidFormatResponse = () =>
  NextResponse.json(
    {
      code: SeasoningTypeUpdateErrorCode.NAME_INVALID_FORMAT,
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
): SeasoningTypeUpdateErrorCode => {
  if (error.message.includes("必須")) {
    return SeasoningTypeUpdateErrorCode.NAME_REQUIRED;
  }

  if (error.message.includes("文字以内")) {
    return SeasoningTypeUpdateErrorCode.NAME_TOO_LONG;
  }

  return SeasoningTypeUpdateErrorCode.NAME_INVALID_FORMAT;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isJsonParseError = (error: unknown): boolean =>
  error instanceof SyntaxError || error instanceof TypeError;
