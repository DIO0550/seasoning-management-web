import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { GetSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/get-seasoning-type";
import { seasoningTypeDetailResponseSchema } from "@/types/api/seasoningType/detail/schemas";
import { errorMapper } from "@/utils/api/error-mapper";
import {
  createContainer,
  INFRASTRUCTURE_IDENTIFIERS,
} from "@/infrastructure/di";

const paramsSchema = z.object({
  typeId: z.coerce.number().int().positive(),
});

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
