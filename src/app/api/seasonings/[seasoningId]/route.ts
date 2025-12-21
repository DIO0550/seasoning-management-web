import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConnectionManager } from "@/infrastructure/database/connection-manager";
import { RepositoryFactory } from "@/infrastructure/di/repository-factory";
import { GetSeasoningUseCase } from "@/features/seasonings/usecases/get-seasoning";
import { errorMapper } from "@/utils/api/error-mapper";

const paramsSchema = z.object({
  seasoningId: z.coerce.number().int().positive(),
});

/**
 * GET /api/seasonings/[seasoningId] - 調味料詳細を取得
 */
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
    const { status, body } = errorMapper.toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}
