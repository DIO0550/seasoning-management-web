import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { GetSeasoningUseCase } from "@/features/seasonings/usecases/get-seasoning";
import { UpdateSeasoningUseCase } from "@/features/seasonings/usecases/update-seasoning";
import { DeleteSeasoningUseCase } from "@/features/seasonings/usecases/delete-seasoning";
import { errorMapper } from "@/utils/api/error-mapper";
import { SEASONING_NAME_MAX_LENGTH } from "@/constants/validation/name-validation";
import { isValidDateString } from "@/utils/date-conversion";

const paramsSchema = z.object({
  seasoningId: z.coerce.number().int().positive(),
});

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => isValidDateString(value), {
    message: "無効な日付です",
  });

const updateBodySchema = z
  .object({
    name: z.string().min(1).max(SEASONING_NAME_MAX_LENGTH).optional(),
    typeId: z.number().int().positive().optional(),
    imageId: z.number().int().positive().nullable().optional(),
    bestBeforeAt: dateStringSchema.nullable().optional(),
    expiresAt: dateStringSchema.nullable().optional(),
    purchasedAt: dateStringSchema.nullable().optional(),
  })
  .strict();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ seasoningId: string }> }
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
        { status: 400 }
      );
    }

    const { seasoningId } = validationResult.data;

    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningRepository =
      await repositoryFactory.createSeasoningRepository();

    const useCase = new GetSeasoningUseCase(seasoningRepository);
    const output = await useCase.execute({ seasoningId });

    return NextResponse.json({ data: output });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("調味料詳細取得エラー:", error);
    } else {
      console.error("調味料詳細取得エラー:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
    }
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ seasoningId: string }> }
) {
  try {
    const resolvedParams = await params;
    const paramsValidation = paramsSchema.safeParse(resolvedParams);

    if (!paramsValidation.success) {
      return NextResponse.json(
        {
          code: "INVALID_PARAMETER",
          message: "無効なパラメータです",
          details: paramsValidation.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const bodyValidation = updateBodySchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "入力内容を確認してください",
          details: bodyValidation.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { seasoningId } = paramsValidation.data;

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

    const useCase = new UpdateSeasoningUseCase(
      seasoningRepository,
      seasoningTypeRepository,
      seasoningImageRepository
    );

    const output = await useCase.execute({
      seasoningId,
      ...bodyValidation.data,
    });

    return NextResponse.json({ data: output }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("調味料更新エラー:", error);
    } else {
      console.error("調味料更新エラー:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
    }
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ seasoningId: string }> }
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
        { status: 400 }
      );
    }

    const { seasoningId } = validationResult.data;

    const connectionManager = ConnectionManager.getInstance();
    const repositoryFactory = new RepositoryFactory(connectionManager);
    const seasoningRepository =
      await repositoryFactory.createSeasoningRepository();

    const useCase = new DeleteSeasoningUseCase(seasoningRepository);
    await useCase.execute({ seasoningId });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("調味料削除エラー:", error);
    } else {
      console.error("調味料削除エラー:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
    }
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}
