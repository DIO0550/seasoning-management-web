import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { GetSeasoningTypeUseCase } from "@/features/seasoning-types/usecases/get-seasoning-type";
import { seasoningTypeDetailResponseSchema } from "@/types/api/seasoningType/detail/schemas";
import { errorMapper } from "@/utils/api/error-mapper";

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
