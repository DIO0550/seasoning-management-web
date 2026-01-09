import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { DuplicateSeasoningUseCase } from "@/features/seasonings/usecases/duplicate-seasoning";
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

const bodySchema = z
  .object({
    name: z.string().min(1).max(SEASONING_NAME_MAX_LENGTH).optional(),
    imageId: z.number().int().positive().nullable().optional(),
    bestBeforeAt: dateStringSchema.nullable().optional(),
    expiresAt: dateStringSchema.nullable().optional(),
    purchasedAt: dateStringSchema.nullable().optional(),
  })
  .strict();

export async function POST(
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

    let body = {};
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const text = await request.text();
      if (text.trim()) {
        body = JSON.parse(text);
      }
    }

    const bodyValidation = bodySchema.safeParse(body);

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
    const [seasoningRepository, seasoningImageRepository] = await Promise.all([
      repositoryFactory.createSeasoningRepository(),
      repositoryFactory.createSeasoningImageRepository(),
    ]);

    const useCase = new DuplicateSeasoningUseCase(
      seasoningRepository,
      seasoningImageRepository
    );

    const output = await useCase.execute({
      seasoningId,
      ...bodyValidation.data,
    });

    return NextResponse.json({ data: output }, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("調味料複製エラー:", error);
    } else {
      console.error("調味料複製エラー:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
    }
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}
